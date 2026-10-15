import type { RepositoryObj } from "@loabot/persistance";

export default class RandomReplyService {
  static async updateRandomReply(
    randomReplyRepository: RepositoryObj["randomReplyRepository"],
    id: string,
    reply: string,
  ) {
    try {
      const isUpdated = await randomReplyRepository.update(id, {
        reply,
      });
      return isUpdated;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
