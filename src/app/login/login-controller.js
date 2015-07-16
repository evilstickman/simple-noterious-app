'use strict';

var theHttp;

angular.module('noterious')
  .controller('LoginCtrl', function (UserModel, Backand, $state, $http, $scope) {

  	theHttp = $http;

    var login = this;

    login.loading = false;

    login.user = {
      email: '',
      password: '',
      register: false
    };

    login.submit = function (user, isValid, isRegistering) {
      if (isValid) {
        login.loading = true;

        if (isRegistering) {

          UserModel.register({
            email: login.user.email,
            password: login.user.password
          })
          .then(function() {
              $state.go('boards');
          })
          .finally(function() {
            login.error = UserModel.error;
            login.reset();
          });

        } else {

          UserModel.login({
            email: login.user.email,
            password: login.user.password
          })
          .then(function() {
            if(!UserModel.error)
              $state.go('boards');
            else
              login.error = UserModel.error;
          },function(ee){
                login.error = UserModel.error;
              })
          .finally(function(reason) {

            login.reset();
          });

        }

      }
    };

    login.reset = function () {
      login.loading = false;
      login.user = {
        email: '',
        password: '',
        register: false
      };
    };

    login.providers = Backand.getSocialProviders();

    login.socialLogin = function (provider) {
      UserModel.socialLogin (provider.name, login.user.register)
        .then(function () {
          if (!UserModel.error) {
            $state.go('boards');
          }
        },
        function () {
          login.error = UserModel.error;
        }
      );
    }

  });

		var s3_doUpdate = function(filename, filedata)
		{
		  console.log('update: filedata.length='+filedata.length);
			var req = {
			 method: 'POST',
			 url: 'https://api.backand.com:8080/1/objects/action/boards?name=upload2s3',
			 headers: {
			   'Content-Type': 'application/json'
			 },
			 data: 
				{
				//"filename":filename,
		    filedata
				}
			}	

			theHttp(req).success(function(res){
				console.log('res='+JSON.stringify(res));
			}).error(function(err){
				alert('err='+err);
			});
		}    

		var file_changed = function(element) {
				var data = element;
		     // $apply(function(scope) {
		         var photofile = data.files[0];
		         var filename = photofile.name;
		         var reader = new FileReader();
		         reader.onload = function(e) {
		         	var b64 = e.currentTarget.result;
		          var filedata = b64;
		          console.log('b64='+b64);
		          //filedata = b64.substring(b64.indexOf("base64,") + 7);
		          //console.log('filedata='+filedata);
		          //var filedata = atob(filedata);
		          //console.log('filedata='+filedata);
		         	s3_doUpdate(filename, filedata);
		         };
		         reader.readAsDataURL(photofile);
		     // });

		}

