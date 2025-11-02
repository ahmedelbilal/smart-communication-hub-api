import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from './insight.entity';
import { Conversation } from '../conversations/conversation.entity';
import OpenAI from 'openai';
import openaiConfig from 'src/core/config/openai.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class InsightsService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Insight)
    private insightsRepo: Repository<Insight>,

    @InjectRepository(Conversation)
    private conversationsRepo: Repository<Conversation>,

    @Inject(openaiConfig.KEY)
    private readonly openaiConf: ConfigType<typeof openaiConfig>
  ) {
    this.openai = new OpenAI({
      apiKey: this.openaiConf.apiKey,
    });
  }

  async generateInsight(conversationId: string): Promise<Insight> {
    let insight = await this.insightsRepo.findOne({
      where: { conversation: { id: conversationId } },
      relations: ['conversation'],
    });

    if (insight) return insight;

    const conversation = await this.conversationsRepo.findOne({
      where: { id: conversationId },
      relations: ['messages', 'messages.sender'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const conversationText = conversation.messages
      .map((m) => `${m.sender.name}: ${m.content}`)
      .join('\n');

    const completion = await this.openai.chat.completions.create({
      model: this.openaiConf.model,
      temperature: this.openaiConf.temperature,
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that summarizes conversations between users in a concise, neutral tone.',
        },
        {
          role: 'user',
          content: `Summarize the following chat:\n\n${conversationText}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content ?? 'No summary generated.';

    insight = this.insightsRepo.create({
      conversation,
      summary,
    });
    return this.insightsRepo.save(insight);
  }

  async getInsight(conversationId: string): Promise<Insight | null> {
    return this.insightsRepo.findOne({
      where: { conversation: { id: conversationId } },
      relations: ['conversation'],
    });
  }
}
