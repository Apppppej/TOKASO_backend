const express = req('express');
const { Pool } = req('pg');
const cors = req('cors');
const argon2 = req('argon2');
const jwt = req('jsonwebtoken');

const app = express( );
app.use(
    cors({
        origin : "*"
    })
);

const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    port : 5432,
    database : 'posts_page',
    password : 'HikigayaHachiman',
    max : 20
});

let user_authentication_attempts = [];
let temporary_blacklist_of_users = [];

pool.connect( ( error , client , release ) => {
    if ( error ) {
        console.log( error );
    }
    
    app.get('/static_data_of_the_main_page' , ( req , res ) => {

    });

    app.get('/static_data_of_editing_pages' , ( req , res ) => {

    });

    app.get('/articles_data' , ( req , res ) => {

        client.query('SELECT * FROM articles_data;' , ( err , result ) => {
            if (err) {
                console.log(err);
            }

            if ( result.rows.length > 0 ) {

                res.status(200).send(result.rows);

            }

        });

    });

    app.post('/creating_an_article' , ( req , res ) => {

        client.query(`SELECT * FROM authentication_data WHERE authentication_code = '${ req.query.authentication_code }';` , ( err , result ) => {
            if (err) {
                console.log(err);
            }

            if ( result.rows.length > 0 ) {

                client.query(`INSERT INTO articles_data ( heading , preview , article ) VALUES ( '${req.query.heading}' , '${req.query.preview}' , '${req.query.article}' );` , ( err , result ) => {
                    release( );
                    if (err) {
                        console.log(err);
                    }

                    res.status(200);

                });

            }

            if ( result.rows.length == 0 ) {
                release( );

                let filtered_authentication_array = user_authentication_attempts.filter( object => object.ip_user == IP_user );
                let filtered_blacklist = temporary_blacklist_of_users.filter( object => object.ip_user == IP_user );

                const user_object = filtering_array[0] || null;
                const object_index = user_authentication_attempts.indexOf( user_object );

                const current_time = new Date().getTime();

                const adding_a_user_authentication_object = ( ) => {

                    user_authentication_attempts.push(
                        {
                            'ip_user' : req.ip || req.ips,
                            'temporary_reserve' : current_time + 60,
                            'attempt' : 1
                        }
                    );

                };

                const deleting_a_user_authentication_object = ( index = object_index ) => {

                    user_authentication_attempts.splice( index , 1 );

                };

                if ( filtered_authentication_array.length == 0 && filtered_blacklist.length == 0 ) {

                    adding_a_user_authentication_object();

                    res.status(400);

                } else if ( filtered_authentication_array.length != 0 && filtered_blacklist.length == 0 ) {

                    if ( current_time < user_object.temporary_reserve ) {

                        if ( user_object.attempt < 3 ) {

                            user_authentication_attempts[ object_index ].attempt++;

                            res.status(400);

                        }

                        if ( user_object.attempt == 3 ) {

                            temporary_blacklist_of_users.push(
                                {
                                    'ip_user' : req.ip || req.ips
                                }
                            );

                            setTimeout( ( ip_user = user_object.ip_user ) => {
                                        
                                const index_of_the_deletion_object = temporary_blacklist_of_users.filter( object => object.ip_user == ip_user );
                                temporary_blacklist_of_users.splice( index_of_the_deletion_object , 1 );

                            }, 60000)

                            deleting_a_user_authentication_object( );

                            res.status(400);

                        }

                    } else {

                        deleting_a_user_authentication_object( );

                        adding_a_user_authentication_object( );

                    }

                } else if ( filtered_authentication_array.length == 0 && filtered_blacklist.length != 0 ) {

                    res.status(403);

                }

            }

        });
        
        // pool.connect( ( error , client , release ) => {
        //     if ( error ) {
        //         console.log( error );
        //     }

        //     client.query(`SELECT * FROM administrator_data WHERE login = '${req.query.login}';`, (err, result) => {
        //         if (err) {
        //             console.log(err);
        //         }

        //         if (result.rows.length > 0) {

        //             const verifyPassword = argon2.verify(result.rows[0].password, req.query.password);

        //             if (verifyPassword) {

        //                 if (verifyPassword) {

        //                     client.query(`INSERT INTO articles_data ( heading , preview , article ) VALUES ( '${req.query.heading}' , '${req.query.preview}' , '${req.query.article}' );` , ( err , result ) => {
        //                         release();
        //                         if ( err ) {
        //                             console.log( err );
        //                         }
                                
        //                         const data = {
        //                             login: req.query.login
        //                         };

        //                         const signature = 'L9ed4en7et5s__R1im0a';
        //                         const expiration = '10h';

        //                         const token = jwt.sign({ data }, signature, { expiresIn: expiration });

        //                         res.status(200).send(token);

        //                     });
                            
        //                 }

        //             }

        //         }

        //     });
            
        // });

    });

    app.listen( 9000 , ( ) => {
        console.log("Ok. Server working!");
    });

});

