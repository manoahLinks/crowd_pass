use starknet::{ContractAddress, storage::Vec};

#[starknet::interface]
pub trait IEventContract<TContractState> {
    fn create_event(
        ref self: TContractState,
        _name: ByteArray,
        _description: ByteArray,
        _image: ByteArray,
        _location: ByteArray,
        _category: felt252,
        _event_type: felt252,
        _start_date: u64,
        _end_date: u64,
        _ticket_price: u256,
        _total_tickets: u256
    ) -> bool;
    fn get_all_events(self: @TContractState) -> Array<Events>;
    // fn reschedule_event(ref self: TContractState, _event_id: u32, _start_date: u64, _end_date:
    // u64);
    fn cancel_event(ref self: TContractState, _event_id: u32);
    fn purchase_ticket(ref self: TContractState, _event_id: u32);
    // fn resale_ticket (ref self : TContractState, event_id: u32) -> bool;
    // fn claim_ticket_refund(ref self: TContractState, _event_id: u32);
    fn get_event(self: @TContractState, _event_id: u32) -> Events;
    fn get_event_count(self: @TContractState) -> u32;
    // fn user_event_ticket (self: @TContractState, _event_id: u32, _user: ContractAddress) -> u256;
}

#[derive(Drop)]
enum EventType {
    free,
    paid
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Events {
    id: u32,
    name: ByteArray,
    description: ByteArray,
    image: ByteArray,
    location: ByteArray,
    organizer: ContractAddress,
    event_type: felt252,
    category: felt252,
    total_tickets: u256,
    tickets_sold: u256,
    ticket_price: u256,
    start_date: u64,
    end_date: u64,
    is_canceled: bool,
    event_ticket_addr: ContractAddress
}

#[starknet::contract]
pub mod EventContract {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait, Map
    };

    use core::option::OptionTrait;
    use core::{traits::{TryInto, Into}, num::traits::zero::Zero};
    use super::{Events, IEventContract};
    use starknet::{get_caller_address, ContractAddress, get_block_timestamp, get_contract_address};

    use contract::{
        errors::event_errors::Errors, tickets::tickets::TicketFactory,
        interfaces::{
            erc721_interface::{IERC721Dispatcher, IERC721DispatcherTrait},
            erc20_interface::{IERC20Dispatcher, IERC20DispatcherTrait}
        },
    };

    component!(path: TicketFactory, storage: tickets_factory, event: TicketFactoryEvent);

    // events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventCreated: EventCreated,
        EventRescheduled: EventRescheduled,
        EventCanceled: EventCanceled,
        TicketPurchased: TicketPurchased,
        TicketRecliamed: TicketRecliamed,
        TicketFactoryEvent: TicketFactory::Event
    }

    #[derive(Drop, starknet::Event)]
    struct EventCreated {
        id: u32,
        organizer: ContractAddress
    }

    #[derive(Drop, starknet::Event)]
    struct EventRescheduled {
        id: u32,
        start_date: u64,
        end_date: u64
    }

    #[derive(Drop, starknet::Event)]
    struct EventCanceled {
        id: u32,
        is_canceled: bool
    }

    #[derive(Drop, starknet::Event)]
    struct TicketPurchased {
        event_id: u32,
        buyer: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    struct TicketRecliamed {
        event_id: u32,
        user_acct: ContractAddress,
        amount: u256
    }

    // storage
    #[storage]
    struct Storage {
        event_count: u32,
        events: Map::<u32, Events>,
        token_address: ContractAddress,
        event_ticket_count: Map::<ContractAddress, u256>,
        user_event_token_id: Map::<(u32, ContractAddress), u256>,
        user_has_claim_refund: Map::<(u32, ContractAddress), bool>,
        #[substorage(v0)]
        tickets_factory: TicketFactory::Storage
    }

    #[constructor]
    fn constructor(ref self: ContractState, _token_address: ContractAddress,) {
        self.token_address.write(_token_address);
    }

    #[abi(embed_v0)]
    impl ticketsImpl = TicketFactory::Tickets<ContractState>;

    // implementions and functions
    #[abi(embed_v0)]
    impl EventContractImpl of IEventContract<ContractState> {
        // ------------------ WRITE FUNCTIONS -----------------------
        fn create_event(
            ref self: ContractState,
            _name: ByteArray,
            _description: ByteArray,
            _image: ByteArray,
            _location: ByteArray,
            _category: felt252,
            _event_type: felt252,
            _start_date: u64,
            _end_date: u64,
            _ticket_price: u256,
            _total_tickets: u256
        ) -> bool {
            let caller = get_caller_address();
            let _event_count = self.event_count.read() + 1;

            // assert not zero ContractAddress
            assert(caller.is_non_zero(), Errors::ZERO_ADDRESS_CALLER);

            let _event_ticket_addr = self.deploy_ticket(caller, caller, _event_count.into());

            // new event struct instance
            let _event_instance = Events {
                id: _event_count,
                name: _name.into(),
                description: _description.into(),
                image: _image.into(),
                location: _location.into(),
                organizer: caller,
                event_type: _event_type.into(),
                category: _category.into(),
                total_tickets: _total_tickets,
                tickets_sold: 0,
                ticket_price: _ticket_price,
                start_date: _start_date,
                end_date: _end_date,
                is_canceled: false,
                event_ticket_addr: _event_ticket_addr
            };

            // map event_id to new_event
            self.events.write(_event_count, _event_instance);

            // update event count
            self.event_count.write(_event_count);

            // emit event for event creation
            self.emit(EventCreated { id: _event_count, organizer: caller });

            true
        }

        fn cancel_event(ref self: ContractState, _event_id: u32) {
            let caller = get_caller_address();
            let _event_count = self.event_count.read();
            let _organizer = self.events.read(_event_id).organizer;
            let event_instance = self.events.read(_event_id);

            assert(_event_id <= _event_count, Errors::NOT_CREATED);

            // assert not zeroAddr caller
            assert(caller.is_non_zero(), Errors::ZERO_ADDRESS_CALLER);

            // assert caller is event organizer
            assert(caller == _organizer, Errors::NOT_ORGANIZER);

            // assert event has not ended
            assert(event_instance.end_date > get_block_timestamp(), Errors::EVENT_ENDED);

            // cancel event here
            self
                .events
                .write(
                    _event_id,
                    Events {
                        id: event_instance.id,
                        name: event_instance.name,
                        description: event_instance.description,
                        image: event_instance.image,
                        location: event_instance.location,
                        organizer: event_instance.organizer,
                        event_type: event_instance.event_type,
                        category: event_instance.category,
                        total_tickets: event_instance.total_tickets,
                        tickets_sold: event_instance.tickets_sold,
                        ticket_price: event_instance.ticket_price,
                        start_date: event_instance.start_date,
                        end_date: event_instance.end_date,
                        is_canceled: true,
                        event_ticket_addr: event_instance.event_ticket_addr
                    }
                );

            self.emit(EventCanceled { id: _event_id, is_canceled: event_instance.is_canceled })
        }

        fn purchase_ticket(ref self: ContractState, _event_id: u32) {
            let caller = get_caller_address();
            let _event_count = self.event_count.read();
            let address_this = get_contract_address();

            let event_instance = self.events.read(_event_id);

            let strk_erc20_contract = IERC20Dispatcher {
                contract_address: self.token_address.read()
            };

            // assert caler is nit addr 0
            assert(caller.is_non_zero(), Errors::ZERO_ADDRESS_CALLER);

            // assert is_valid event
            assert(_event_id <= _event_count, Errors::NOT_CREATED);

            // verify if token caller has enough strk for the ticket_price
            assert(
                strk_erc20_contract.balance_of(caller) >= event_instance.ticket_price,
                Errors::INSUFFICIENT_AMOUNT
            );

            let _event_ticket_price: u256 = event_instance.ticket_price;

            // transfer strk from callers address to  smart contract
            strk_erc20_contract.transfer_from(caller, address_this, _event_ticket_price);

            // mint the nft ticket to the user
            let _event_ticket_address = event_instance.event_ticket_addr;

            let ticket_nft = IERC721Dispatcher { contract_address: _event_ticket_address };

            ticket_nft.mint_ticket_nft(caller);

            // update tickets sold
            let _tickets_sold = event_instance.tickets_sold + 1;

            // update legacymap with user token_id
            self.user_event_token_id.write((_event_id, caller), _tickets_sold);

            // increase ticket_sold count from event instance
            self
                .events
                .write(
                    _event_id,
                    Events {
                        id: event_instance.id,
                        name: event_instance.name,
                        description: event_instance.description,
                        image: event_instance.image,
                        location: event_instance.location,
                        organizer: event_instance.organizer,
                        event_type: event_instance.event_type,
                        category: event_instance.category,
                        total_tickets: event_instance.total_tickets,
                        tickets_sold: _tickets_sold,
                        ticket_price: event_instance.ticket_price,
                        start_date: event_instance.start_date,
                        end_date: event_instance.end_date,
                        is_canceled: event_instance.is_canceled,
                        event_ticket_addr: event_instance.event_ticket_addr
                    }
                );

            // emit event for ticket purchase
            self
                .emit(
                    TicketPurchased {
                        event_id: _event_id, buyer: caller, amount: event_instance.ticket_price
                    }
                );
        }

        // -------------- GETTER FUNCTIONS -----------------------

        fn get_all_events(self: @ContractState) -> Array<Events> {
            let mut events = array![];
            let _count = self.event_count.read();
            let mut i: u32 = 1;

            while i < _count + 1 {
                let event: Events = self.events.read(i);
                events.append(event);
                i += 1;
            };

            events
        }

        fn get_event_count(self: @ContractState) -> u32 {
            self.event_count.read()
        }

        fn get_event(self: @ContractState, _event_id: u32) -> Events {
            self.events.read(_event_id)
        }
    }
}
