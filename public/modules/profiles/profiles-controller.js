module.exports = function(DataService) {
    let vm = this;
    
    DataService.getMembersByUsername("")
    .then(data=>{
        vm.members = data;
        console.dir(vm.members);
    });

}