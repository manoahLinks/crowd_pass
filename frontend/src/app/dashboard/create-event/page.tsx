"use client"

import React from 'react'
import { Field, Formik } from "formik";
import {   Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';


type Props = {}

const page = (props: Props) => {
  return (
    <div className="w-full mt-10 flex justify-center items-center">
        <Card className="w-full bg-light-black border-0 border-none max-w-2xl shadow-2xl mb-4">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create New Event</CardTitle>
            <CardDescription className="text-white text-xs">
              Fill out the details for your upcoming event.
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={{
              name: "",
              description: "",
              city: "",
              country: "",
              start_date: new Date(),
              end_date: new Date(),
              expiry_date: new Date(),
              event_url: "https://poap.xyz",
              virtual_event: false,
              img: "",
              email: "",
              event_template_id: 1,
              private_event: false,
              notify_issuer: true,
              requested_codes: 10,
              start_time: "00:00",
              end_time: "00:00",
              eventCategory: "free"
           
            }}
            onSubmit={async (values, { setSubmitting }) => {
              console.log(values)
              setSubmitting(true);
              const toast1 = toast.loading("Creating Events");
              try {
              
                toast.remove(toast1);
                toast.success("Event Created");
                // console.log(formData)
              } catch (error) {
                toast.remove(toast1);
                toast.error("error creating event");
                console.log(error);
              }
            }}
          >
            {({
              values,
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="name" className="text-white">
                        Event Name
                      </label>
                      <Field
                      className="rounded-md"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        placeholder={"input your name"}
                      />
                      <div className="text-red-900 text-sm">
                        {errors.name && touched.name && errors.name}
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="email" className="text-white">
                        Email
                      </label>
                      <Field
                      className="rounded-md"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        placeholder={"input your mail"}
                      />
                      <div className="text-red">
                        {errors.email && touched.email && errors.email}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="ticket-price" className="text-white">
                        City
                      </label>
                      <Field
                      className="rounded-md"
                        type="text"
                        name="city"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.city}
                        placeholder={"input event city"}
                      />
                      <div className="text-red-900 text-sm">
                        {" "}
                        {errors.city && touched.city && errors.city}
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="ticket-price" className="text-white">
                        Country
                      </label>
                      <Field
                      className="rounded-md"
                        type="text"
                        name="country"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.country}
                        placeholder={"input event country"}
                      />
                      <div className="text-red-900 text-sm">
                        {" "}
                        {errors.country && touched.country && errors.country}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label
                        htmlFor="event-category"
                        className="text-white"
                      >
                        Event Category
                      </label>
                      <Field
                      className="rounded-md"
                        as="select"
                        name="eventCategory"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.eventCategory}
                        placeholder={"Describe your event..."}
                      >
                        <option >Free</option>
                        <option >Paid</option>
                        <option >Private</option>
                      </Field>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="event-type" className="text-white">
                        Event Type
                      </label>
                      <Field
                      className="rounded-md"
                        as="select"
                        name="virtual_event"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.virtual_event}
                      >
                        <option >Physical</option>
                        <option >Virtual</option>
                      </Field>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Start Date
                      </label>
                      <Field
                      className="rounded-md"
                        name="start_time"
                        type="datetime-local"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.start_time}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        End Date
                      </label>
                      <Field
                      className="rounded-md"
                        name="end_time"
                        type="datetime-local"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.end_time}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Event Description
                      </label>
                      <Field
                      className="rounded-md"
                        as="textarea"
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        placeholder={"Describe your event..."}
                      />
                      <div className="text-red-900 text-sm">
                        {" "}
                        {errors.description &&
                          touched.description &&
                          errors.description}
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="start-date" className="text-white">
                        Poap Image
                      </label>
                      <input
                        type="file"
                        name="img"
                        accept="image/*"
                        onChange={(event) => {
                          handleChange({
                            target: {
                              name: "img",
                            },
                          });
                        }}
                        onBlur={handleBlur}
                      />
                      <div className="text-red-900 text-sm"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    className="text-light-black hover:text-white bg-primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Event..." : "Create Event"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Formik>
        </Card>
      </div>
  )
}

export default page