// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

let express    = require("express"),              // ExpressJS module 'Express' for Node web framework
    router     = express.Router(),
    passport   = require("passport");



// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //

/* ~~~~~~~~~~ Newsletter ~~~~~~~~~~ */
router.get("/newsletter", function(req, res){
    res.render("footer/newsletter");
});

// Need to flush out errors on sign up, not displaying any errors ever currently
router.post("/newsletter", function(req, res) {
    var email = req.body.email;

    // Data for MailChimp API
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {}
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url      = process.env.MAILCHIMP  // Combine MC API URL with my main list ID, '8' comes from API key process.env.GMAILPW                   //String password
    const options  = {
        method: "POST",
        auth: process.env.MAILCHIMPAUTH              // Can use anything for username, key for pwd
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200) {
            req.flash("success", "You've been succeessfully subscribed to the Cyclone Analytics newsletter!");
            return res.redirect("/home");
        } else {
            req.flash("error", "There's been an issue with your signup, maybe you're already subscribed!");
            return res.redirect("/home");
        }

        /*response.on("data", function(data){
            console.log(JSON.parse(data));
        });*/
    });

    request.write(jsonData);
    request.end();
});



/* ~~~~~~~~~~ About ~~~~~~~~~~ */
router.get("/about", function(req, res){
    res.render("footer/about");
});


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export index routes for use within application 
module.exports = router;
