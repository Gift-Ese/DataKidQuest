export type UserRole = 'CHILD' | 'PARENT' | 'ADMIN' | 'SPONSOR';

export type LanguageCode = 'en-NG' | 'yo' | 'ig' | 'ha' | 'pcm';
export type LocaleEnum = 'en_NG' | 'yo_NG' | 'ig_NG' | 'ha_NG' | 'pcm_NG';
export type MediaTypeEnum = 'image' | 'audio' | 'video' | 'text';
export type VerificationStatusEnum = 'pending' | 'groq_generated' | 'approved' | 'rejected';

export type GameTypeEnum = 
  // Level 1: "Snap Tag"
  | 'image_single_box' 
  | 'audio_classification' 
  | 'video_action_tag' 
  | 'qa_binary'
  // Level 2: "Precision Box"
  | 'image_multi_box' 
  | 'audio_transcription' 
  | 'video_timestamp' 
  | 'qa_multi_error'
  // Level 3: "Spot the Glitch"
  | 'image_qa_box' 
  | 'audio_emotion' 
  | 'video_phase_tag' 
  | 'qa_label_swap'
  // Level 4: "Tracker Track"
  | 'image_part_tag' 
  | 'audio_dialect' 
  | 'video_trajectory' 
  | 'qa_hallucination'
  // Level 5: "Master Evaluator"
  | 'image_occlusion' 
  | 'audio_qa' 
  | 'video_anomaly' 
  | 'qa_multimodal';

export interface TierQuotaConfig {
  level: LevelNumber;
  title: string;
  accessStatus: 'FREE' | 'PREMIUM';
  quota: number;
  mechanicCode: string;
  mechanicTitle: string;
  primaryLearningFocus: string;
}

export const TIER_QUOTAS: Record<LevelNumber, TierQuotaConfig> = {
  1: {
    level: 1,
    title: 'Data Explorer',
    accessStatus: 'FREE',
    quota: 20,
    mechanicCode: 'SNAP_TAG',
    mechanicTitle: 'Snap Tag',
    primaryLearningFocus: 'Binary classification, single bounding boxes, basic sound & action tags.',
  },
  2: {
    level: 2,
    title: 'Data Annotator',
    accessStatus: 'PREMIUM',
    quota: 75,
    mechanicCode: 'PRECISION_BOX',
    mechanicTitle: 'Precision Box',
    primaryLearningFocus: 'Multi-class bounding boxes, speech transcription, event timestamping.',
  },
  3: {
    level: 3,
    title: 'Data Reviewer',
    accessStatus: 'PREMIUM',
    quota: 100,
    mechanicCode: 'SPOT_THE_GLITCH',
    mechanicTitle: 'Spot the Glitch',
    primaryLearningFocus: 'Bounding box QA, tone/intent tagging, action phase & trajectory tracking.',
  },
  4: {
    level: 4,
    title: 'AI Quality Inspector',
    accessStatus: 'PREMIUM',
    quota: 125,
    mechanicCode: 'TRACKER_TRACK',
    mechanicTitle: 'Tracker Track',
    primaryLearningFocus: 'Multi-frame object persistence, dialect validation, hallucination detection.',
  },
  5: {
    level: 5,
    title: 'Data Quality Specialist',
    accessStatus: 'PREMIUM',
    quota: 150,
    mechanicCode: 'MASTER_EVALUATOR',
    mechanicTitle: 'Master Evaluator',
    primaryLearningFocus: 'Multi-class occlusion tracking, complex contextual validation, multi-modal alignment.',
  },
};

export const TOTAL_BASE_QUOTA = 470; // 20 + 75 + 100 + 125 + 150

export interface MediaAssetDB {
  id: string;
  title: string;
  media_type: MediaTypeEnum;
  storage_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  frame_rate?: number;
  width?: number;
  height?: number;
  nigerian_context_tag: string;
  license_type: string;
  status: VerificationStatusEnum;
  created_at: string;
}

export interface QuestTemplateDB {
  id: string;
  template_code: string;
  game_type: GameTypeEnum;
  level: LevelNumber;
  base_instructions: Record<string, string>;
  default_scoring_rules: Record<string, any>;
  default_xp_reward: number;
  created_at: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export type AgeGroup = 'EXPLORER' | 'CREATOR' | 'INNOVATOR' | '7-9' | '10-13' | '14-17';

export interface AgeGroupConfig {
  id: AgeGroup;
  title: string;
  ageRange: string;
  description: string;
  badge: string;
}

export type AnnotationType = 
  | 'IMAGE' 
  | 'TEXT' 
  | 'AUDIO' 
  | 'VIDEO'
  | 'IMAGE_BOUNDING_BOX'
  | 'TEXT_SENTIMENT'
  | 'AUDIO_CLASSIFICATION'
  | 'VIDEO_TRACKING'
  | 'QA_INSPECTION';

export type LevelNumber = 1 | 2 | 3 | 4 | 5;

export interface LevelInfo {
  level: LevelNumber;
  title: string;
  subtitle: string;
  description: string;
  isFree: boolean;
  bossQuestTitle: string;
  badgeId: string;
  iconName: string;
  color: string;
}

export interface BoundingBox {
  id: string;
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  width: number; // 0 to 1 normalized
  height: number; // 0 to 1 normalized
  label: string;
  color?: string;
}

export type QAErrorType = 
  | 'CORRECT'
  | 'WRONG_LABEL'
  | 'WRONG_BOUNDING_BOX'
  | 'MISSING_OBJECT'
  | 'EXTRA_OBJECT'
  | 'WRONG_TRANSCRIPTION'
  | 'WRONG_FRAME'
  | 'TRACKING_ERROR'
  | 'OTHER';

export interface GroundTruthImage {
  type: 'IMAGE';
  boxes: BoundingBox[];
  requiredLabels: string[];
  minIoUThreshold?: number; // default 0.65
}

export interface GroundTruthText {
  type: 'TEXT';
  sentiment?: 'positive' | 'neutral' | 'negative';
  category?: string;
  intent?: string;
  entities?: Array<{
    start: number;
    end: number;
    text: string;
    label: string;
  }>;
}

export interface GroundTruthAudio {
  type: 'AUDIO';
  correctSoundClass: string;
  transcription?: string;
  soundEvents?: Array<{
    startSec: number;
    endSec: number;
    label: string;
  }>;
}

export interface GroundTruthVideo {
  type: 'VIDEO';
  frames: Array<{
    frameNumber: number;
    timeSec: number;
    boxes: BoundingBox[];
    actionLabel?: string;
  }>;
  overallAction?: string;
}

export interface GroundTruthQA {
  type: 'QA';
  aiProposal: {
    label?: string;
    boxes?: BoundingBox[];
    transcription?: string;
    sentiment?: string;
    confidence: number;
  };
  isAiCorrect: boolean;
  actualErrorType: QAErrorType;
  correctedAnswer: string | BoundingBox[] | object;
  explanation: string;
}

export type GroundTruth = 
  | GroundTruthImage 
  | GroundTruthText 
  | GroundTruthAudio 
  | GroundTruthVideo 
  | GroundTruthQA;

export type ContentStatus = 'AI_DRAFT' | 'HUMAN_REVIEW' | 'SAFETY_APPROVED' | 'PUBLISHED';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  learning_objective: string;
  age_group?: AgeGroup | 'ALL';
  level: LevelNumber | number;
  annotation_type: AnnotationType;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  dataset_context?: string;
  media_content?: {
    type?: AnnotationType;
    image_url?: string;
    url?: string;
    alt_text?: string;
    alt?: string;
    category?: string;
    text_content?: string;
    textContent?: string;
    audio_synth_type?: string;
    audioSynthType?: 'rain' | 'birds' | 'traffic' | 'drum' | 'whistle' | 'market' | 'bell';
    video_frames?: string[];
    videoFrames?: string[];
    media_rights_status?: 'PUBLIC_DOMAIN' | 'CREATIVE_COMMONS' | 'ORIGINAL' | 'APPROVED_EDUCATIONAL';
    sourceName?: string;
  };
  media_asset?: {
    type: AnnotationType;
    url?: string;
    alt: string;
    category: string;
    textContent?: string;
    audioSynthType?: 'rain' | 'birds' | 'traffic' | 'drum' | 'whistle' | 'market' | 'bell';
    videoFrames?: string[];
    media_rights_status: 'PUBLIC_DOMAIN' | 'CREATIVE_COMMONS' | 'ORIGINAL' | 'APPROVED_EDUCATIONAL';
    sourceName: string;
  };
  instruction?: string;
  instructions?: string;
  available_labels?: string[];
  availableLabels?: string[];
  ground_truth?: any;
  ground_truth_qa?: GroundTruthQA;
  is_qa_mode?: boolean;
  is_catch_ai_mode?: boolean;
  is_boss_quest?: boolean;
  boss_stages?: string[];
  xp_reward: number;
  estimated_minutes?: number;
  estimated_time_min?: number;
  language_translations?: Partial<Record<LanguageCode, {
    title: string;
    description: string;
    instructions: string;
    learning_objective: string;
    hints: string[];
  }>>;
  content_status?: ContentStatus;
  safety_status?: 'SAFE_FOR_CHILDREN' | 'FLAGGED';
  created_by?: string;
  reviewed_by?: string;
  approved_by?: string;
  created_at?: string;
}

export interface EvaluationResult {
  questId: string;
  accuracy: number; // 0 to 100
  isSuccess: boolean;
  scoreGrade: 'EXCELLENT' | 'GOOD' | 'NEEDS_PRACTICE';
  xpEarned: number;
  feedbackTitle: string;
  feedbackMessage: string;
  educationalTakeaway: string;
  iouScore?: number;
  detectedErrors?: QAErrorType[];
  groundTruthData?: GroundTruth;
  // Aliases for component ergonomics
  passed?: boolean;
  score?: number;
  feedback?: string;
  earnedXp?: number;
}

export interface ChildProfile {
  id: string;
  nickname: string;
  avatar: string;
  age_group: AgeGroup;
  preferred_language: LanguageCode;
  xp: number;
  level: LevelNumber | number;
  completed_quests: string[];
  completed_quest_ids?: string[];
  quest_attempts?: Array<{
    questId: string;
    accuracy: number;
    xp: number;
    timestamp: string;
    annotationType: AnnotationType;
  }>;
  accuracy_by_type?: Record<string, {
    totalAttempts: number;
    totalAccuracy: number;
    averageAccuracy: number;
    initialAccuracy: number;
    recentAccuracy: number;
  }>;
  accuracy_stats: {
    image: { attempts: number; successes: number; avgIoU: number };
    text: { attempts: number; successes: number };
    audio: { attempts: number; successes: number };
    video: { attempts: number; successes: number };
    qa: { attempts: number; successes: number };
  };
  badges: string[];
  streak_days: number;
  last_active_date?: string;
  is_premium?: boolean;
  is_premium_unlocked: boolean;
  premium_expires_at?: string;
  is_sponsored?: boolean;
  sponsor_program_id?: string;
  has_seen_first_aha?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'FOUNDATION' | 'VISION' | 'TEXT' | 'AUDIO' | 'VIDEO' | 'QA' | 'AI_INSPECTOR' | 'BOSS';
  xpBonus: number;
  unlockedAt?: string;
}

export interface ParentAccount {
  id: string;
  email: string;
  children: ChildProfile[];
  subscription?: {
    status: 'ACTIVE' | 'EXPIRED' | 'NONE';
    product: string;
    price: number;
    currency: string;
    durationMonths: number;
    expiresAt: string;
    autoRenew: boolean;
  };
  consentSettings: {
    allowAnalytics: boolean;
    allowQuestBotVoice: boolean;
    allowEducationalEmailUpdates: boolean;
  };
}

export interface SponsorshipProgram {
  id: string;
  sponsorName: string;
  tierId: string;
  childCount: number;
  amount: number;
  currency: string;
  createdAt: string;
  allocatedCount: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface PricingConfig {
  product: string;
  price: number;
  currency: string;
  durationMonths: number;
  status: 'ACTIVE' | 'PAUSED';
  features: string[];
}

export type AppView = 
  | 'QUEST_HUB' 
  | 'WORKSPACE' 
  | 'PARENT_DASHBOARD' 
  | 'SPONSOR_PAGE' 
  | 'ADMIN_PORTAL'
  | 'BOSS_ARENA'
  | 'CATCH_AI_ZONE'
  | 'LEADERBOARD'
  | 'ABOUT_MLQUEST';
