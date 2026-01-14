import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/manage-reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportManagerController::reports
* @see app/Http/Controllers/ReportManagerController.php:13
* @route '/manage-reports'
*/
reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reports.form = reportsForm

const manage = {
    reports: Object.assign(reports, reports),
}




export default manage