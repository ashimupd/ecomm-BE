const sql = require('mssql');
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Validate input
    if (!req.body.name || !req.body.email){
        context.res = {
            status: 400,
            body: "Name and email are required"
        }
    }

    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber || null;
    const date = new Date();

    try {
        await sql.connect(process.env.dbConnectionString);

        const existingUser = await sql.query`SELECT * FROM EmailList WHERE Email = ${email}`;
        
        if (existingUser?.recordset?.length > 0) {
            context.res = {
                status: 409,
                body: "user with this email already exisits"
            }
            return;
        }
        const result = await sql.query`INSERT INTO EmailList (Name, Email, PhoneNumber, DateAdded) VALUES (${name}, ${email}, ${phoneNumber}, ${date})`;
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Data inserted with success"
        };
    }
    catch (err)
    {
        context.log.error('SQL error: Error connecting to the db', err);
        context.res = {
            status: 500,
            body: "Error connecting to the db"
        }
    }
}