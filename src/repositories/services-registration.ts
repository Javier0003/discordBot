import BotStatusRepository from "./bot-status-repository";
import CommentRepository from "./comment-repository";
import MapasRepository from "./mapas-repository";
import PlayRepository from "./play-repository";
import RandomReplyRepository from "./random-reply-repository";
import ServerUserRepository from "./server-user-repository";
import SessionRepository from "./session-repository";
import UserRepository from "./user-repository";

export type RepositoryObj = {
    userRepository: UserRepository;
    mapasRepository: MapasRepository;
    botStatusRepository: BotStatusRepository;
    serverUsersRepository: ServerUserRepository;
    randomReplyRepository: RandomReplyRepository;
    playRepository: PlayRepository;
    sessionRepository: SessionRepository;
    commentRepository: CommentRepository
}

export function registerRepositories(): RepositoryObj {
  return {
    userRepository: new UserRepository(),
    mapasRepository: new MapasRepository(),
    botStatusRepository: new BotStatusRepository(),
    serverUsersRepository: new ServerUserRepository(),
    randomReplyRepository: new RandomReplyRepository(),
    playRepository: new PlayRepository(),
    sessionRepository: new SessionRepository(),
    commentRepository: new CommentRepository()
  } as const;
}