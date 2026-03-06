import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import BotStatusRepository from "./repositories/bot-status-repository";
import CommentRepository from "./repositories/comment-repository";
import MapasRepository from "./repositories/mapas-repository";
import MinecraftServerRepository from "./repositories/minecraft-server-repository";
import PlayRepository from "./repositories/play-repository";
import RandomReplyRepository from "./repositories/random-reply-repository";
import ServerUserRepository from "./repositories/server-user-repository";
import SessionRepository from "./repositories/session-repository";
import UserRepository from "./repositories/user-repository";
import { runMigration } from "./utils/migrator";

export type RepositoryObj = {
    userRepository: UserRepository;
    mapasRepository: MapasRepository;
    botStatusRepository: BotStatusRepository;
    serverUsersRepository: ServerUserRepository;
    randomReplyRepository: RandomReplyRepository;
    playRepository: PlayRepository;
    sessionRepository: SessionRepository;
    commentRepository: CommentRepository;
    minecraftServersRepository: MinecraftServerRepository;
}

export function registerRepositories(db: PostgresJsDatabase<Record<string, never>>): RepositoryObj {
  runMigration()


  return {
    userRepository: new UserRepository(db),
    mapasRepository: new MapasRepository(db),
    botStatusRepository: new BotStatusRepository(db),
    serverUsersRepository: new ServerUserRepository(db),
    randomReplyRepository: new RandomReplyRepository(db),
    playRepository: new PlayRepository(db),
    sessionRepository: new SessionRepository(db),
    commentRepository: new CommentRepository(db),
    minecraftServersRepository: new MinecraftServerRepository(db),
  } as const;
}