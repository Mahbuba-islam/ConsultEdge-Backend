export class QueryBuilder {
    constructor(model, queryParams, config) {
        this.model = model;
        this.queryParams = queryParams;
        this.config = config;
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
        this.sortBy = "createdAt";
        this.sortOrder = "desc";
        this.selectFields = {};
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            skip: 0,
            take: 10,
        };
        this.countQuery = {
            where: {},
        };
    }
    // SEARCH
    search() {
        const { searchTerm } = this.queryParams;
        const { searchableFields } = this.config;
        // doctorSearchableFields = ['user.name', 'user.email', 'specialties.specialty.title' , 'specialties.specialty.description']
        if (searchTerm && searchableFields && searchableFields.length > 0) {
            const searchConditions = searchableFields.map((field) => {
                if (field.includes(".")) {
                    const parts = field.split(".");
                    if (parts.length === 2) {
                        const [relation, nestedField] = parts;
                        const stringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive',
                        };
                        return {
                            [relation]: {
                                [nestedField]: stringFilter
                            }
                        };
                    }
                    else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts;
                        const stringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive',
                        };
                        return {
                            [relation]: {
                                some: {
                                    [nestedRelation]: {
                                        [nestedField]: stringFilter
                                    }
                                }
                            }
                        };
                    }
                }
                // direct field
                const stringFilter = {
                    contains: searchTerm,
                    mode: 'insensitive',
                };
                return {
                    [field]: stringFilter
                };
            });
            const whereConditions = this.query.where;
            whereConditions.OR = searchConditions;
            const countWhereConditions = this.countQuery.where;
            countWhereConditions.OR = searchConditions;
        }
        return this;
    }
    // FILTER
    filter() {
        const { filterableFields } = this.config;
        const excludedField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];
        const filterParams = {};
        Object.keys(this.queryParams).forEach((key) => {
            if (!excludedField.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        });
        const queryWhere = this.query.where;
        const countQueryWhere = this.countQuery.where;
        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];
            if (value === undefined || value === "") {
                return;
            }
            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
            // doctorFilterableFields = ['specialties.specialty.title', 'appointmentFee']
            // /doctors?appointmentFee[lt]=100&appointmentFee[gt]=50 => { appointmentFee: { lt: '100', gt: '50' } }
            // /doctors?user.name=John => { user: { name: 'John' } }
            if (key.includes(".")) {
                const parts = key.split(".");
                if (filterableFields && !filterableFields.includes(key)) {
                    return;
                }
                if (parts.length === 2) {
                    const [relation, nestedField] = parts;
                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }
                    const queryRelation = queryWhere[relation];
                    const countRelation = countQueryWhere[relation];
                    queryRelation[nestedField] = this.parseFilterValue(value);
                    countRelation[nestedField] = this.parseFilterValue(value);
                    return;
                }
                else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts;
                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {
                            some: {}
                        };
                        countQueryWhere[relation] = {
                            some: {}
                        };
                    }
                    const queryRelation = queryWhere[relation];
                    const countRelation = countQueryWhere[relation];
                    if (!queryRelation.some) {
                        queryRelation.some = {};
                    }
                    if (!countRelation.some) {
                        countRelation.some = {};
                    }
                    const querySome = queryRelation.some;
                    const countSome = countRelation.some;
                    if (!querySome[nestedRelation]) {
                        querySome[nestedRelation] = {};
                    }
                    if (!countSome[nestedRelation]) {
                        countSome[nestedRelation] = {};
                    }
                    const queryNestedRelation = querySome[nestedRelation];
                    const countNestedRelation = countSome[nestedRelation];
                    queryNestedRelation[nestedField] = this.parseFilterValue(value);
                    countNestedRelation[nestedField] = this.parseFilterValue(value);
                    return;
                }
            }
            if (!isAllowedField) {
                return;
            }
            // Range filter parsing
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parseRangeFilter(value);
                countQueryWhere[key] = this.parseRangeFilter(value);
                return;
            }
            //direct value parsing
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        });
        return this;
    }
    //paginate
    paginate() {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;
        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;
        this.query.skip = this.skip;
        this.query.take = this.limit;
        return this;
    }
    //sort 
    sort() {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        if (sortBy.includes(".")) {
            const parts = sortBy.split(".");
            if (parts.length === 2) {
                const [realation, nestedField] = parts;
                this.query.orderBy = {
                    [realation]: {
                        [nestedField]: sortOrder
                    }
                };
            }
            else if (parts.length === 3) {
                const [realation, nestedRealition, nestedField] = parts;
                this.query.orderBy = {
                    [realation]: {
                        [nestedField]: {
                            [nestedRealition]: sortOrder
                        }
                    }
                };
            }
            else {
                this.query.orderBy = {
                    [sortBy]: sortOrder
                };
            }
        }
        return this;
    }
    //  //fields
    //  fields():this{
    //   const fieldsParams = this.queryParams.fields
    // if(fieldsParams && typeof fieldsParams === 'string'){
    //     const fieldsArray = fieldsParams?.split(',').map(field => field.trim())
    //   this.selectFields = {}
    //   fieldsArray?.forEach(field => {
    //     if(this.selectFields){
    //       this.selectFields[field] = true
    //     }
    //   })
    //   this.query.select = this.selectFields as Record<string, boolean | Record<string, unknown>>
    //   delete this.query.include
    // }
    //   return this
    //  }
    //include
    include(relation) {
        // if(this.selectFields){
        //   return this
        // }
        if (Object.keys(this.selectFields).length > 0)
            return this;
        //if fields methods is used, include method will be ignored to prevent conflict between select and include
        this.query.include = { ...this.query.include, ...relation };
        return this;
    }
    //dynamicInclude
    dynamicInclude(includeConfig, defaultInclude) {
        if (this.selectFields) {
            return this;
        }
        const result = {};
        defaultInclude?.forEach(field => {
            if (includeConfig[field]) {
                result[field] = includeConfig[field];
            }
        });
        const includeParam = this.queryParams.includes;
        if (includeParam && typeof includeParam === 'string') {
            const requestRelations = includeParam.split(",").map(relation => relation.trim());
            requestRelations.forEach(relation => {
                if (includeConfig[relation]) {
                    result[relation] = includeConfig[relation];
                }
            });
        }
        this.query.include = { ...this.query.include, ...result };
        return this;
    }
    fields() {
        const fieldsParams = this.queryParams.fields;
        if (fieldsParams && typeof fieldsParams === 'string') {
            const fieldsArray = fieldsParams.split(',').map(field => field.trim());
            this.selectFields = {};
            fieldsArray.forEach(field => {
                this.selectFields[field] = true;
            });
            // Just set select, don't delete include
            this.query.select = this.selectFields;
        }
        return this;
    }
    //where
    where(condition) {
        this.query.where = this.deepMerge(this.query.where, condition);
        this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
        return this;
    }
    //excute
    async excute() {
        const [total, data] = await Promise.all([
            this.model.count(this.countQuery),
            this.model.findMany(this.query)
        ]);
        const totalPages = Math.ceil(total / this.limit);
        return {
            data: data,
            meta: {
                page: this.page,
                limit: this.limit,
                total,
                totalPages
            }
        };
    }
    //count
    async count() {
        return await this.model.count(this.countQuery);
    }
    //debugging purpose method
    getQuery() {
        return this.query;
    }
    //deep merge
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
                    result[key] = this.deepMerge(result[key], source[key]);
                }
                else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }
    parseFilterValue(value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (typeof value === 'string' && !isNaN(Number(value)) && value != "") {
            return Number(value);
        }
        if (Array.isArray(value)) {
            return { in: value.map((item) => this.parseFilterValue(item)) };
        }
        return value;
    }
    parseRangeFilter(value) {
        const rangeQuery = {};
        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];
            const parsedValue = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
            switch (operator) {
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parsedValue;
                    break;
                case 'in':
                case 'notIn':
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue;
                    }
                    else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default:
                    break;
            }
        });
        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}
//# sourceMappingURL=queryBuilder.js.map