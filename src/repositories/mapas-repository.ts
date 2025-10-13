import { mapas } from "../../drizzle/schemas/schema";
import GenericRepository from "./GenericRepository";

export default class MapasRepository extends GenericRepository<typeof mapas, typeof mapas.oldMaps> {
    constructor() {
        super(mapas, mapas.oldMaps);
    }
}