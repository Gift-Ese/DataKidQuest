import { LanguageCode } from '../types';

export interface GroundTruthProposal {
  game_type: string;
  level: number;
  nigerian_context_tag: string;
  instructions: {
    en_NG: string;
    yo_NG: string;
    ig_NG: string;
    ha_NG: string;
    pcm_NG: string;
  };
  available_labels: string[];
  ground_truth: Record<string, any>;
  tolerance_thresholds: {
    min_iou?: number;
    time_buffer_sec?: number;
    allow_partial_match?: boolean;
  };
  xp_reward: number;
  ai_evaluation_trap?: {
    is_flawed: boolean;
    error_type: string;
    flawed_prediction: Record<string, any>;
    explanation: string;
  };
}

export async function requestGroqQuestGeneration(params: {
  mediaType: 'image' | 'audio' | 'video' | 'text';
  mediaUrl: string;
  contextTag: string;
  level: number;
  gameType?: string;
}): Promise<GroundTruthProposal> {
  const response = await fetch('/api/groq/generate-quest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Groq generation failed with status: ${response.status}`);
  }

  return response.json();
}
