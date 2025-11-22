import { mapas } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class MapasRepository extends GenericRepository<typeof mapas> {
    constructor() {
        super(mapas);
    }
}