const assert = require('assert');
const salonBooking = require('../salon-booking');
const pgp = require('pg-promise')();

// TODO configure this to work.
const DATABASE_URL =   process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/salon";

const config = {
	connectionString : DATABASE_URL
}


const db = pgp(config);

let mybooking = salonBooking(db);

describe("The Booking Salon", function () {

    beforeEach(async function () {

        await db.none(`delete from booking`);

    });

    it("should be able to list treatments", async function () {

        const treatments = await mybooking.findAllTreatments();
        assert.deepEqual([
            { treatment_type: 'Pedicure' },
            { treatment_type: 'Manicure' },
            { treatment_type: 'Make up' },
            { treatment_type: 'Brows & Lashes' }
          ], treatments);
    });

    it("should be able to find a stylist", async function () {

        const stylist = await mybooking.findStylist('0834029770');
        assert.deepEqual([
            {
              id: 1,
              first_name: 'WISEMAN',
              last_name: 'MABUSELA',
              phone_number: '0834029770',
              commission_percentage: '0.10'
            }
          ], stylist);
    });
    it("should be able to find a treatment using short code", async function () {

        const treatment = await mybooking.findTreatment('PD123');
        assert.deepEqual([
            {
              code: 'PD123',
              id: 1,
              price: 175,
              treatment_type: 'Pedicure'
            }
          ], treatment);
    });


    it("should be able to allow a client to make a booking", async function () {

        const stylist = await mybooking.findStylist('0834029770')
        const stylist_id = stylist[0].id;
        const client = await mybooking.findClient('0834529653');
        const treatmentData = await mybooking.findTreatment('PD123')
        const treatmentId = treatmentData[0].id;
        let date = '2022-02-27'
        let time = '07:00'

        await mybooking.makeBooking(treatmentId, client.id, date, time, stylist_id);

        const bookings = await mybooking.findClientBookings(client.id);
        assert.deepEqual( [{
            booking_date: '2022-02-27',
            booking_time: '07:00:00',
            first_name: 'NOAH',
            last_name: 'LYLES',
            phone_number: '0834529653',
            price: 175,
            treatment_type: 'Pedicure'
          }], bookings);
    });

    it("should be able to get client booking(s)", async function () {
        // first booking
        const stylist = await mybooking.findStylist('0834029770')
        const stylist_id = stylist[0].id;
        const client = await mybooking.findClient('0834529653');
        const treatmentData = await mybooking.findTreatment('PD123')
        const treatmentId = treatmentData[0].id;
        let date = '2022-02-27'
        let time = '07:00'

        await mybooking.makeBooking(treatmentId, client.id, date, time, stylist_id);

        //second booking
        const stylist2 = await mybooking.findStylist('0608705525')
        const stylist_id2 = stylist2[0].id;
        const client2 = await mybooking.findClient('0636043256');
        const treatmentData2 = await mybooking.findTreatment('MA123')
        const treatmentId2 = treatmentData2[0].id;
        let date2 = '2022-02-15'
        let time2 = '09:55'

        await mybooking.makeBooking(treatmentId2, client2.id, date2, time2, stylist_id2);
        const bookings = await mybooking.findAllBookings();

        assert.deepEqual([
            {
              booking_date: '2022-02-27',
              booking_time: '07:00:00',
              first_name: 'NOAH',
              last_name: 'LYLES',
              phone_number: '0834529653',
              price: 175,
              treatment_type: 'Pedicure'
            },
            {
              booking_date: '2022-02-15',
              booking_time: '09:55:00',
              first_name: 'YOHAN',
              last_name: 'BLAKE',
              phone_number: '0636043256',
              price: 215,
              treatment_type: 'Manicure'
            }
          ], bookings)
    })

    it("a client can book for 2 different treatment types", async function () {

        const stylist = await mybooking.findStylist('0834029770')
        const stylist_id = stylist[0].id;
        const client = await mybooking.findClient('0834529653');
        const treatmentData = await mybooking.findTreatment('PD123')
        const treatmentId = treatmentData[0].id;
        let date = '2022-02-27'
        let time = '07:00'

        await mybooking.makeBooking(treatmentId, client.id, date, time, stylist_id);

        const stylist2 = await mybooking.findStylist('0834029770')
        const stylist_id2 = stylist2[0].id;
        const client2 = await mybooking.findClient('0834529653');
        const treatmentData2 = await mybooking.findTreatment('BL123')
        const treatmentId2 = treatmentData2[0].id;
        let date2 = '2022-02-27'
        let time2 = '07:15'

        await mybooking.makeBooking(treatmentId2, client2.id, date2, time2, stylist_id2);

        const bookings = await mybooking.findClientBookings(client.id);
        assert.deepEqual( [
            {
              booking_date: '2022-02-27',
              booking_time: '07:00:00',
              first_name: 'NOAH',
              last_name: 'LYLES',
              phone_number: '0834529653',
              price: 175,
              treatment_type: 'Pedicure'
            },
            {
              booking_date: '2022-02-27',
              booking_time: '07:15:00',
              first_name: 'NOAH',
              last_name: 'LYLES',
              phone_number: '0834529653',
              price: 240,
              treatment_type: 'Brows & Lashes'
            }
          ], bookings);
    });

   /* it("should be able to get bookings for a date", async function () {

        const stylist2 = await mybooking.findStylist('0834029770')
        const stylist_id2 = stylist2[0].id;
        const client2 = await mybooking.findClient('0834529653');
        const treatmentData2 = await mybooking.findTreatment('BL123')
        const treatmentId2 = treatmentData2[0].id;
        let date2 = '2022-02-27'
        let time2 = '07:15:00'

        await mybooking.makeBooking(treatmentId2, client2.id, date2, time2, stylist_id2);

        let date3 = '2022-02-27'
        let time3 = '07:15'

        const bookings = await mybooking.findAllBookingsByDate({date3, time3});

        assert.equal([], bookings);

    });*/

    it("should be able to find the total income for a day",async function() {

        const stylist = await mybooking.findStylist('0834029770')
        const stylist_id = stylist[0].id;
        const client = await mybooking.findClient('0834529653');
        const treatmentData = await mybooking.findTreatment('PD123')
        const treatmentId = treatmentData[0].id;
        let date = '2022-02-27'
        let time = '07:00'

        await mybooking.makeBooking(treatmentId, client.id, date, time, stylist_id);

        //second booking
        const stylist2 = await mybooking.findStylist('0608705525')
        const stylist_id2 = stylist2[0].id;
        const client2 = await mybooking.findClient('0636043256');
        const treatmentData2 = await mybooking.findTreatment('MA123')
        const treatmentId2 = treatmentData2[0].id;
        let date2 = '2022-02-15'
        let time2 = '09:55'
        await mybooking.makeBooking(treatmentId2, client2.id, date2, time2, stylist_id2);

        //third booking
        const stylist3 = await mybooking.findStylist('0608705525')
        const stylist_id3 = stylist3[0].id;
        const client3 = await mybooking.findClient('0636043256');
        const treatmentData3 = await mybooking.findTreatment('MP123')
        const treatmentId3 = treatmentData3[0].id;
        let date3 = '2022-02-15'
        let time3 = '09:55'

        await mybooking.makeBooking(treatmentId3, client3.id, date3, time3, stylist_id3);
        const bookings = await mybooking.findAllBookingsSum();

        assert.deepEqual([
            {
              sum: '575'
            }
          ], bookings);
    })


    it("should be able to find the most valuable client",async function() {

        const stylist = await mybooking.findStylist('0834029770')
        const stylist_id = stylist[0].id;
        const client = await mybooking.findClient('0834529653');
        const treatmentData = await mybooking.findTreatment('PD123')
        const treatmentId = treatmentData[0].id;
        let date = '2022-02-27'
        let time = '07:00'

        await mybooking.makeBooking(treatmentId, client.id, date, time, stylist_id);

        //second booking
        const stylist2 = await mybooking.findStylist('0608705525')
        const stylist_id2 = stylist2[0].id;
        const client2 = await mybooking.findClient('0636043256');
        const treatmentData2 = await mybooking.findTreatment('MA123')
        const treatmentId2 = treatmentData2[0].id;
        let date2 = '2022-02-15'
        let time2 = '09:55'
        await mybooking.makeBooking(treatmentId2, client2.id, date2, time2, stylist_id2);

        //third booking
        const stylist3 = await mybooking.findStylist('0608705525')
        const stylist_id3 = stylist3[0].id;
        const client3 = await mybooking.findClient('0636043256');
        const treatmentData3 = await mybooking.findTreatment('MP123')
        const treatmentId3 = treatmentData3[0].id;
        let date3 = '2022-02-15'
        let time3 = '09:55'

        await mybooking.makeBooking(treatmentId3, client3.id, date3, time3, stylist_id3);
        const bookings = await mybooking.maxClient();

        assert.deepEqual([
            [
                {
                  max: 215
                }
              ]
          ], bookings);
    })
    /*it("should be able to find the total commission for a given stylist", function() {
        assert.equal(1, 2);
    })*/

    after(function () {
        db.$pool.end()
    });

});