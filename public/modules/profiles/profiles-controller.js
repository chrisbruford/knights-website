module.exports = function(DataService) {
    let vm = this;
    
    DataService.getMembers()
    .then(data=>{
        vm.members = data;
    });

}