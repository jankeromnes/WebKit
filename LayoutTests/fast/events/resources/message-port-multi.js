if (window.testRunner) {
    testRunner.dumpAsText();
    testRunner.waitUntilDone();
}

description("This test checks the various use cases around sending multiple ports through MessagePort.postMessage");

var channel = new MessageChannel();
var channel2 = new MessageChannel();
var channel3 = new MessageChannel();
var channel4 = new MessageChannel();

channel.port1.postMessage("noport");
channel.port1.postMessage("zero ports", []);
channel.port1.postMessage("two ports", [channel2.port1, channel2.port2]);

// Now test various failure cases
shouldThrow('channel.port1.postMessage("same port", [channel.port1])');
shouldThrow('channel.port1.postMessage("entangled port", [channel.port2])');
shouldThrow('channel.port1.postMessage("null port", [channel3.port1, null, channel3.port2])');
shouldThrow('channel.port1.postMessage("notAPort", [channel3.port1, {}, channel3.port2])');
// Should be OK to send channel3.port1 (should not have been disentangled by the previous failed calls).
channel.port1.postMessage("entangled ports", [channel3.port1, channel3.port2]);

shouldThrow('channel.port1.postMessage("notAnArray", channel3.port1)')
shouldThrow('channel.port1.postMessage("notASequence", [{length: 3}])');

// Should not crash (we should figure out that the array contains undefined
// entries).
var largePortArray = [];
largePortArray[1234567890] = channel4.port1;
shouldThrow('channel.port1.postMessage("largeSequence", largePortArray)');

channel.port1.postMessage("done");

function testTransfers() {
    var channel0 = new MessageChannel();

    var c1 = new MessageChannel();
    channel0.port1.webkitPostMessage({id:"send-port", port:c1.port1}, [c1.port1]);
    var c2 = new MessageChannel();
    channel0.port1.webkitPostMessage({id:"send-port-twice", port0:c2.port1, port1:c2.port1}, [c2.port1]);
    var c3 = new MessageChannel();
    channel0.port1.webkitPostMessage({id:"send-two-ports", port0:c3.port1, port1:c3.port2}, [c3.port1, c3.port2]);
    var c4 = new MessageChannel();
    try {
        channel0.port1.webkitPostMessage({id:"host-object", hostObject:c3, port:c4.port1}, [c4.port1]);
        testFailed("Sending host object should throw");
    } catch(e) {
        testPassed("Sending host object has thrown " + e);
    }
    c4.port1.postMessage("Should succeed");
    channel0.port1.webkitPostMessage({id:"done"});

    channel0.port2.onmessage = function(event) {
        if (event.data.id == "send-port") {
            if (event.ports && event.ports.length > 0 && event.ports[0] === event.data.port)
                testPassed("send-port: transferred one port");
            else 
                testFailed("send-port: port transfer failed");
        } else if (event.data.id == "send-port-twice") {
            if (event.ports && event.ports.length == 1 && 
                  event.ports[0] === event.data.port0 && event.ports[0] === event.data.port1) 
                testPassed("send-port-twice: transferred one port twice");
            else
                testFailed("send-port-twice: failed to transfer one port twice");
        } else if (event.data.id == "send-two-ports") {
            if (event.ports && event.ports.length == 2 && 
                  event.ports[0] === event.data.port0 && event.ports[1] === event.data.port1) 
                testPassed("send-two-ports: transferred two ports");
            else
                testFailed("send-two-ports: failed to transfer two ports");
        } else if (event.data.id == "done") {
            debug('<br><span class="pass">TEST COMPLETE</span>');
            if (window.testRunner)
            testRunner.notifyDone();
        } else {
            testFailed("Unexpected message " + event.data);
        }
    }
}

channel.port2.onmessage = function(event) {
    if (event.data == "noport") {
        if (event.ports && !event.ports.length)
            testPassed("event.ports is non-null and zero length when no port sent");
        else
            testFailed("event.ports is null or non-zero length when no port sent");
    } else if (event.data == "zero ports") {
        if (event.ports && !event.ports.length)
            testPassed("event.ports is non-null and zero length when empty array sent");
        else
            testFailed("event.ports is null or non-zero length when empty array sent");
    } else if (event.data == "two ports") {
        if (!event.ports) {
            testFailed("event.ports should be non-null when ports sent");
            return;
        }
        if (event.ports.length == 2)
            testPassed("event.ports contains two ports when two ports sent");
        else
            testFailed("event.ports contained " + event.ports.length + " when two ports sent");

    } else if (event.data == "entangled ports") {
        if (event.ports.length == 2)
            testPassed("event.ports contains two ports when two ports re-sent after error");
        else
            testFailed("event.ports contained " + event.ports.length + " when two ports re-sent after error");
    } else if (event.data == "done") {
        testTransfers();
    } else
        testFailed("Received unexpected message: " + event.data);
}

