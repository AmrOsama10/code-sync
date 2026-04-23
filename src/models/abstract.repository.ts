import { DeleteResult, Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(doc: Partial<T>) {
        const newDoc = new this.model(doc);
        return newDoc.save();
    }

    async getOne(
        filter: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOne(filter, projection, options) as Promise<T | null>;
    }
    
    async getAll(
        filter?: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>) {
        return this.model.find(filter, projection, options)
    }

    async exists(
        filter: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOne(filter, projection, options) as Promise<T | null>;
    }
    
    async update(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOneAndUpdate(filter, update, {...options, returnDocument: 'after'})
    } 
    
    async delete(
        filter: QueryFilter<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOneAndDelete(filter, {...options, returnDocument: 'after'});
    }

    async deleteAll(filter?: QueryFilter<T>): Promise<DeleteResult> {
        return this.model.deleteMany(filter)
    }
}