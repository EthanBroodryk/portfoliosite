import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/job-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:108
* @route '/job-cards'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/job-cards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:114
* @route '/job-cards/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:128
* @route '/job-cards'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/job-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:128
* @route '/job-cards'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:128
* @route '/job-cards'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:128
* @route '/job-cards'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:128
* @route '/job-cards'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
export const my = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

my.definition = {
    methods: ["get","head"],
    url: '/job-cards/my',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
my.url = (options?: RouteQueryOptions) => {
    return my.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
my.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
my.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: my.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
const myForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
myForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::my
* @see app/Http/Controllers/JobCardController.php:71
* @route '/job-cards/my'
*/
myForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: my.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

my.form = myForm

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
export const show = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/job-cards/{jobCard}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
show.url = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jobCard: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { jobCard: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            jobCard: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        jobCard: typeof args.jobCard === 'object'
        ? args.jobCard.id
        : args.jobCard,
    }

    return show.definition.url
            .replace('{jobCard}', parsedArgs.jobCard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
show.get = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
show.head = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
const showForm = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
showForm.get = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::show
* @see app/Http/Controllers/JobCardController.php:96
* @route '/job-cards/{jobCard}'
*/
showForm.head = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\JobCardController::update
* @see app/Http/Controllers/JobCardController.php:15
* @route '/job-cards/{jobCard}'
*/
export const update = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/job-cards/{jobCard}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\JobCardController::update
* @see app/Http/Controllers/JobCardController.php:15
* @route '/job-cards/{jobCard}'
*/
update.url = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jobCard: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { jobCard: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            jobCard: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        jobCard: typeof args.jobCard === 'object'
        ? args.jobCard.id
        : args.jobCard,
    }

    return update.definition.url
            .replace('{jobCard}', parsedArgs.jobCard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::update
* @see app/Http/Controllers/JobCardController.php:15
* @route '/job-cards/{jobCard}'
*/
update.put = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\JobCardController::update
* @see app/Http/Controllers/JobCardController.php:15
* @route '/job-cards/{jobCard}'
*/
const updateForm = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JobCardController::update
* @see app/Http/Controllers/JobCardController.php:15
* @route '/job-cards/{jobCard}'
*/
updateForm.put = (args: { jobCard: number | { id: number } } | [jobCard: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const jobcards = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    my: Object.assign(my, my),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
}

export default jobcards