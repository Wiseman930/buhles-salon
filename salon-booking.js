module.exports = function salonBooking(db) {


    async function findAllTreatments(){
        let treatment =  await db.manyOrNone('SELECT treatment_type FROM treatment')
        return treatment;
      }
    async function findStylist(number){
        let getStylist;
        let numberTest = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
        if(numberTest.test(number) === true){
        getStylist =  await db.manyOrNone('SELECT * FROM stylist WHERE phone_number=$1', [number])
        }

        return getStylist;
    }
    async function findTreatment(code){
        let getTreatment;
        if(code.length == 5 ){
        getTreatment =  await db.manyOrNone('SELECT * FROM treatment WHERE code=$1', [code])
        }
        return getTreatment;
    }

    async function findClient(number){
        let numberTest = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/
        let clientObj;
        if(numberTest.test(number) === true){
        getClient =  await db.manyOrNone('SELECT * FROM client WHERE phone_number=$1', [number])
        }
        for(let i = 0; i < getClient.length; i++){
            clientObj = getClient[i]
        }
        return clientObj;
    }
    async function makeBooking(treatmentId, client_id, date, time, stylist_id){

        let count = await db.oneOrNone(`SELECT COUNT(*) FROM booking WHERE
        treatment_id=$1 AND client_id=$2 AND booking_date=$3 AND booking_time=$4 AND stylist_id=$5`,
        [treatmentId, client_id, date, time, stylist_id])

        if(count.count == 0){
        await db.manyOrNone(`INSERT INTO booking (treatment_id, client_id, booking_date, booking_time, stylist_id)
        values ($1, $2, $3, $4, $5)`, [treatmentId, client_id, date, time, stylist_id])
        }
    }
    async function findClientBookings(client_id){

        let client_data = await db.manyOrNone(`SELECT client.first_name, client.last_name, client.phone_number,
        treatment.treatment_type, treatment.price, CAST(booking.booking_date AS VARCHAR), booking.booking_time
        FROM booking
        INNER JOIN client ON booking.client_id = client.id
        INNER JOIN treatment ON booking.treatment_id = treatment.id
        INNER JOIN stylist ON booking.stylist_id = stylist.id WHERE client.id =$1`, [client_id])
        return client_data;
    }
    async function findAllBookings(){

        let client_data = await db.manyOrNone(`SELECT client.first_name, client.last_name, client.phone_number,
        treatment.treatment_type, treatment.price, CAST(booking.booking_date AS VARCHAR), booking.booking_time
        FROM booking
        INNER JOIN client ON booking.client_id = client.id
        INNER JOIN treatment ON booking.treatment_id = treatment.id
        INNER JOIN stylist ON booking.stylist_id = stylist.id`)

        return client_data;
    }
    async function findAllBookingsByDate(date2, time2){

        let client_data = await db.manyOrNone(`SELECT client.first_name, client.last_name, client.phone_number,
        treatment.treatment_type, treatment.price, CAST(booking.booking_date AS VARCHAR), booking.booking_time
        FROM booking
        INNER JOIN client ON booking.client_id = client.id
        INNER JOIN treatment ON booking.treatment_id = treatment.id
        INNER JOIN stylist ON booking.stylist_id = stylist.id WHERE booking.booking_date=$1 AND booking.booking_time=$2`,[date2, time2])

        return client_data;
    }
    async function findAllBookingsSum(){

        let client_data = await db.manyOrNone(`SELECT SUM(treatment.price)
        FROM booking
        INNER JOIN client ON booking.client_id = client.id
        INNER JOIN treatment ON booking.treatment_id = treatment.id
        INNER JOIN stylist ON booking.stylist_id = stylist.id`)

        return client_data;
    }
    async function maxClient(){

        let client_data = await db.manyOrNone(`SELECT MAX(treatment.price)
        FROM booking
        INNER JOIN client ON booking.client_id = client.id
        INNER JOIN treatment ON booking.treatment_id = treatment.id
        INNER JOIN stylist ON booking.stylist_id = stylist.id`)

        return client_data;
    }

    return {
        findAllTreatments,
        findStylist,
        findClient,
        makeBooking,
        findTreatment,
        findClientBookings,
        findAllBookings,
        findAllBookingsByDate,
        findAllBookingsSum,
        maxClient
    }
}