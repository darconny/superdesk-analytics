ContentQuotaReportPanel.$inject = [
    'config', 'api', 'session', 'metadata', 'notify', '$rootScope', 'desks', 'contentQuotaReport'
];

/**
 * @ngdoc directive
 * @module superdesk.apps.analytics.content-quota-report
 * @name sdContentQuotaReportPanel
 * @requires config
 * @requires api
 * @requires session
 * @requires notify
 * @requires $rootScope
 * @requires desks
 * @requires contentQuotaReport
 * @description A directive that generates the sidebar containing content quota reports parameters
 */
export function ContentQuotaReportPanel(config, api, session, metadata, notify, $rootScope, desks, contentQuotaReport) {
    return {
        template: require('../views/content-quota-report-panel.html'),
        scope: {},
        link: function(scope, element, attrs, controller) {
            var noOfIntervalsDefault = 7,
                intervalLengthDefault = 1;

            /**
             * @ngdoc method
             * @name sdContentQuotaReportPanel#init
             * @description Initialises the content quota report object
            */
            scope.init = function() {
                scope.report = {intervals_number: noOfIntervalsDefault, interval_length: intervalLengthDefault};
            };

            metadata.initialize().then(() => {
                scope.metadata = metadata.values;
            });

            /**
             * @ngdoc method
             * @name sdContentQuotaReportPanel#generate
             * @description Generate the report
             */
            scope.generate = function() {
                function onSuccess(contentQuotaReport) {
                    $rootScope.$broadcast('view:content_quota_report', contentQuotaReport);
                    notify.success(gettext('The report was genereated successfully'));
                }

                function onFail(error) {
                    if (angular.isDefined(error.data._message)) {
                        notify.error(error.data._message);
                    } else {
                        notify.error(gettext('Error. The report could not be generated.'));
                    }
                }

                return contentQuotaReport.generate(scope.report).then(onSuccess, onFail);
            };

            scope.init();
        }
    };
}
