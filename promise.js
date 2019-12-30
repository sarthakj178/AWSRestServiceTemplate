const request = require('request');
const requestPromise = require('request-promise');

/**
 * Demo function to represent an incorrect usage of Promise within Lambda.
 * The function does not wait for the http call to complete before returning
 * 
 * Invoke the function as 
 * `echo '{}' | sam local invoke PromiseDemoIncorrectFunction`
 * 
 * Expected output: (Returning before http call completes)
 * START RequestId: 2d00858a-1aeb-118d-42a3-271e2429e32d Version: $LATEST
 * 2019-12-30T05:13:30.219Z        2d00858a-1aeb-118d-42a3-271e2429e32d    Returning output from Lambda null
 * 2019-12-30T05:13:31.331Z        2d00858a-1aeb-118d-42a3-271e2429e32d    ip address received {"ip":"125.99.157.122"}
 * END RequestId: 2d00858a-1aeb-118d-42a3-271e2429e32d
 * REPORT RequestId: 2d00858a-1aeb-118d-42a3-271e2429e32d  Init Duration: 589.57 ms        Duration: 1128.44 ms    Billed Duration: 1200 ms        Memory Size: 128 MB       Max Memory Used: 51 MB
 * 
 * null

 */
exports.demo_incorrect = function(event, context, callback) {
    let output = null;
    request.get(
        { url: 'https://api.ipify.org/?format=json', qs: {} },

        (error, response, body) => {
            if (error) {
                console.error('Error while getting ip address', error);
                return;
            }
            console.log('ip address received', body);
            output = response.ip;
        }
    );
    console.log('Returning output from Lambda', output);
    callback(null, output);
};

/**
 * Demo function to fix the above defined incorrect usage of Promise.
 * The async call is wrapped in a Promise block and the Lambda function waits for the Promise to complete.
 * 
 * Invoke the function as 
 * `echo '{}' | sam local invoke PromiseDemoWrapFunction`
 * 
 * Expected output: 
 * START RequestId: 1771b335-fae5-189b-9a44-3bafb00fbff0 Version: $LATEST
 * 2019-12-30T05:25:22.708Z        1771b335-fae5-189b-9a44-3bafb00fbff0    ip address received {"ip":"125.99.157.122"}
 * 2019-12-30T05:25:22.709Z        1771b335-fae5-189b-9a44-3bafb00fbff0    Returning output from Lambda {"ip":"125.99.157.122"}
 * END RequestId: 1771b335-fae5-189b-9a44-3bafb00fbff0
 * REPORT RequestId: 1771b335-fae5-189b-9a44-3bafb00fbff0  Init Duration: 585.05 ms        Duration: 1012.63 ms    Billed Duration: 1100 ms        Me
mory Size: 128 MB       Max Memory Used: 51 MB
 *
 * "{\"ip\":\"125.99.157.122\"}"

 */
exports.demo_wrap_promise = function(event, context, callback) {
    const outputPromise = new Promise((resolve, reject) => {
        return request.get(
            { url: 'https://api.ipify.org/?format=json', qs: {} },

            (error, response, ip) => {
                if (error) {
                    console.error('Error while getting ip address', error);
                    reject();
                }
                console.log('ip address received', ip);
                resolve(ip);
            }
        );
    });
    // Do any other unrelated processing here
    outputPromise.then(ip => {
        console.log('Returning output from Lambda', ip);
        callback(null, ip);
    });
};
/**
 * Demo function to fix the above defined incorrect usage of Promise.
 * Async/await syntax is used with request-promise to make the code more readable/
 * 
 * Invoke the function as 
 * `echo '{}' | sam local invoke PromiseDemoAwaitFunction`
 * 
 * Expected output: 
 * START RequestId: 7c1a3701-eb00-1b99-d661-974fa03824ac Version: $LATEST
 * 2019-12-30T05:31:24.235Z        7c1a3701-eb00-1b99-d661-974fa03824ac    ip address received {"ip":"125.99.157.122"}
 * 2019-12-30T05:31:24.236Z        7c1a3701-eb00-1b99-d661-974fa03824ac    Returning output from Lambda {"ip":"125.99.157.122"}
 * END RequestId: 7c1a3701-eb00-1b99-d661-974fa03824ac
 * REPORT RequestId: 7c1a3701-eb00-1b99-d661-974fa03824ac  Init Duration: 1008.54 ms       Duration: 930.97 ms     Billed Duration: 1000 ms        Memory Size: 128 MB       Max Memory Used: 57 MB
 *
 * "{\"ip\":\"125.99.157.122\"}"

 */
exports.demo_async_await = async function(event) {
    let output = null;
    try {
        output = await requestPromise.get('https://api.ipify.org/?format=json', {});
        console.log('ip address received', output);
    } catch (error) {
        console.error('error while getting ip address', error);
        throw error;
    }
    console.log('Returning output from Lambda', output);
    return output;
};
