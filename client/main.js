import angular from 'angular';
import angularMeteor from 'angular-meteor';


angular.module('wheelchairService', [
        angularMeteor
    ])
    .controller('wheelchair', function($scope, $reactive, $http) {
        'ngInject';

        var vm = this;

        // data
        vm.formDetails = {};
        var req = {
            method: 'GET'
        };
        var date = new Date();
        var appId = ''; // enter your App id
        var appKey = ''; // enter your App Key

        // Mthods
        vm.dateConvert = dateConvert;
        vm.timeConvert = timeConvert;
        vm.submitForm = submitForm;

        // functions
        function dateConvert(convertDate) {
            return moment(new Date(convertDate)).format('DDMMMYYYY');
        }

        function timeConvert(convertTime) {
            return moment(new Date(convertTime)).format('HH:mm');
        }


        $('#demo').daterangepicker({
            "startDate": moment().format("MM/DD/YYYY"),
            "endDate": moment().format("MM/DD/YYYY"),
            "minDate": moment().subtract(1, "year").format("MM/DD/YYYY"),
            "maxDate": moment().format("MM/DD/YYYY"),
        }, function(start, end, label) {
            vm.formDetails.start = start;
            vm.formDetails.end = end;
        });

        $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DDMMMYYYY'));
        });



        function submitForm(formSubmit) {
            if (formSubmit) {
                var airplancode = "";
                var airplanId = "";
                var data = vm.formDetail.number;

                req.url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/" + data.slice(0, 2) + "/" + String(parseInt(data.slice(2, 6))) + "/dep/" + vm.formDetails.start.format('YYYY/MM/DD') + "?appId=" + appId + "&appKey=" + appKey + "&utc=false";

                $http(req).then(function(res) {

                    vm.result = res.data;
                    if (res.data.error.errorCode) {
                        alert(res.data.error.errorCode);
                    } else {
                        vm.airportDetail = {};
                        angular.forEach(vm.result.appendix.airports, function(value, key) {
                            vm.airportDetail[value.iata] = value;
                        });
                    }
                });

            }
        }
    });