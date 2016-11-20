"use strict";

describe("LoginCtrl", function () {
    beforeEach(module('kokApp'));

    let controller, scope;

    let AuthService = {
        authenticate(user) {
            return new Promise((resolve, reject) => {
                resolve(user);
            })
        }
    }

    beforeEach(inject(function ($controller, $rootScope) {
        controller = $controller;
        scope = $rootScope.$new();
    }));

    it('should set success boolean to be true', function (done) {
        let thisController = controller('LoginCtrl', { $scope: scope, AuthService: AuthService });

        spyOn(AuthService, 'authenticate').and.callThrough();

        function failTest(error) {
            expect(error).toBeUndefined();
        }

        thisController.cmdrName = "dummy";
        thisController.password = "dummyP";
        thisController.authenticate()
            .then(() => {
                expect(AuthService.authenticate).toHaveBeenCalledWith({
                    username: "dummy",
                    password: "dummyP"
                });
                expect(thisController.authentication.success).toBe(true);
                expect(thisController.cmdrName).toBe('dummy');
                done();
            })
            .catch(failTest);

    });
})