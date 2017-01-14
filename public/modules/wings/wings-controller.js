"use strict";
module.exports = function(wings) {
    let vm = this;
    vm.wings = wings;
    vm.joinStatus = {};
    
    vm.wings.forEach((wing)=>{
        vm.joinStatus[wing.name] = null;
    })

    vm.joinWing = (wing) => {
        console.log(`joining wing ${wing.name}`);
        vm.joinStatus[wing.name] = "loading";
    }
}