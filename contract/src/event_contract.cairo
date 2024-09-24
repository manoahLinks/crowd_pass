use starknet::{ContractAddress};

#[starknet::interface]
pub trait IEventContract<TContractState> {
    fn create_event(
        ref self: TContractState,
        _name: felt252,
        _description: felt252,
        _image: felt252,
        _location: felt252,
        _event_type: felt252,
        _start_date: u64,
        _end_date: u64,
        _ticket_price: u256,
        _total_tickets: u256
    ) -> bool;
    // fn reschedule_event(ref self: TContractState, _event_id: u32, _start_date: u64, _end_date: u64);
    // fn cancel_event(ref self: TContractState, _event_id: u32);
    // fn purchase_ticket(ref self: TContractState, _event_id: u32);
    // fn resale_ticket (ref self : TContractState, event_id: u32) -> bool;
    // fn claim_ticket_refund(ref self: TContractState, _event_id: u32);
    // fn get_event(self: @TContractState, _event_id: u32) -> Events;
    // fn get_event_count(self: @TContractState) -> u32;
    // fn user_event_ticket (self: @TContractState, _event_id: u32, _user: ContractAddress) -> u256;
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Events {
    id: u32,
    name: felt252,
    description: felt252,
    image: felt252,
    location: felt252,
    organizer: ContractAddress,
    event_type: felt252,
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
    use core::option::OptionTrait;
    use core::{traits::{TryInto, Into}, num::traits::zero::Zero};
    use super::{Events, IEventContract};
    use starknet::{get_caller_address, ContractAddress, get_block_timestamp, get_contract_address};

    // events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventCreated: EventCreated,
        EventRescheduled: EventRescheduled,
        EventCanceled: EventCanceled,
        TicketPurchased: TicketPurchased,
        TicketRecliamed: TicketRecliamed
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
        events: LegacyMap::<u32, Events>,
        token_address: ContractAddress,
        event_ticket_count: LegacyMap::<ContractAddress, u256>,
        user_event_token_id: LegacyMap::<(u32, ContractAddress), u256>,
        user_has_claim_refund: LegacyMap::<(u32, ContractAddress), bool>
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        _token_address: ContractAddress,
    ) {
        self.token_address.write(_token_address);
    }

    // implementions and functions
    #[abi(embed_v0)]
    impl EventContractImpl of IEventContract<ContractState> {
        fn create_event(
            ref self: ContractState,
            _name: felt252,
            _description: felt252,
            _image: felt252,
            _location: felt252,
            _event_type: felt252,
            _start_date: u64,
            _end_date: u64,
            _ticket_price: u256,
            _total_tickets: u256
        ) -> bool {
            let caller = get_caller_address();
            let _event_count = self.event_count.read() + 1;
            let address_this = get_contract_address();

            // assert not zero ContractAddress
            assert(caller.is_non_zero(), token_bound::errors::Errors::ZERO_ADDRESS_CALLER);

            // deploy tickets contract here
            let ticket_factory = ITicketFactoryDispatcher {
                contract_address: self.ticket_factory_address.read()
            };

            let _event_ticket_addr = ticket_factory
                .deploy_ticket(caller, address_this, _event_count.into());

            // new event struct instance
            let event_instance = Events {
                id: _event_count,
                name: _name.into(),
                description: _description,
                image: _image,
                location: _location,
                organizer: caller,
                event_type: _event_type,
                total_tickets: _total_tickets,
                tickets_sold: 0,
                ticket_price: _ticket_price,
                start_date: _start_date,
                end_date: _end_date,
                is_canceled: false,
                event_ticket_addr: _event_ticket_addr
            };

            // map event_id to new_event
            self.events.write(_event_count, event_instance);

            // update event count
            self.event_count.write(_event_count);

            // emit event for event creation
            self.emit(EventCreated { id: _event_count, organizer: caller });

            true
        }
    }    
}
