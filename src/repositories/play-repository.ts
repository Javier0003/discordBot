import { and, asc, eq } from "drizzle-orm";
import { plays } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository"

export default class PlayRepository extends GenericRepository<typeof plays> {
    constructor() {
        super(plays)
    }


    public async getByUserId(userId: string) {
        return this.getQueryable().where(eq(this.entity.uId, userId));
    }

    public async getByMapId(mapId: number) {
        return this.getQueryable().where(eq(this.entity.mapId, mapId));
    }

    public getPlayOrder(mapId: number) {
        return this.getQueryable().orderBy(asc(plays.puntos)).where(eq(plays.mapId, mapId))
    }

    public async addPointsToUserPlay(uId: string, points: number, mapId: number) {
        await this.db.update(plays)
            .set({
                puntos: points,
            })
            .where(and(eq(plays.uId, uId), eq(plays.mapId, mapId)))
    }

    public async getUserPlay(uid: string, mapId: number) {
        const play = await this.getQueryable()
            .where(and(eq(plays.uId, uid), eq(plays.mapId, mapId)))

        return play[0];
    }

    public async updateUserPlay(uid: string, mapId: number, play: {
        accuracy: string,
        rank: string,
        score: number,
        puntos: number,
        pp: number,
        combo: number
    }) {
        await this.db.update(plays)
            .set({
                accuracy: play.accuracy.toString(),
                mapId: mapId,
                rank: play.rank,
                score: play.score,
                uId: uid,
                puntos: play.puntos,
                pp: play.pp,
                combo: play.combo
            })
            .where(and(eq(plays.uId, uid), eq(plays.mapId, mapId)))
    }
}