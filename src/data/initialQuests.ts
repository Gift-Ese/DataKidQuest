import { Quest, LevelNumber, AnnotationType, GameTypeEnum } from '../types';

// =========================================================================
// MLQuest Africa — DataKidQuest Nigerian Curated Core & Template Engine
// 470 Base Quests: Level 1 (20) + Level 2 (75) + Level 3 (100) + Level 4 (125) + Level 5 (150)
// =========================================================================

// Curated Handcrafted Quests for Flagship Demonstrations
const CURATED_QUESTS: Quest[] = [
  // --- LEVEL 1: SNAP TAG (Free Tier - 20 Target Quota) ---
  {
    id: 'l1_img_01',
    title: 'Lagos Yellow Bus (Danfo) Spotter',
    description: 'Find and draw a clean bounding box around the iconic yellow Danfo minibus.',
    learning_objective: 'Understand how bounding boxes teach computer vision models where vehicles are on a road.',
    level: 1,
    annotation_type: 'IMAGE',
    difficulty: 'EASY',
    dataset_context: 'Lagos Urban Mobility Dataset',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80',
      alt: 'Lagos street with a yellow Danfo bus in traffic',
      category: 'Transportation',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'African Mobility Dataset',
    },
    instructions: 'Click and drag to draw a single bounding box around the yellow Danfo bus.',
    availableLabels: ['Danfo Bus', 'Keke Napep', 'Pedestrian', 'Tree'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'gt_1', x: 0.22, y: 0.35, width: 0.52, height: 0.46, label: 'Danfo Bus' }
      ],
      requiredLabels: ['Danfo Bus'],
    },
    xp_reward: 50,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l1_img_02',
    title: 'Keke Napep Tricycle Detector',
    description: 'Help the self-driving navigation AI locate a green and yellow Keke tricycle on the street.',
    learning_objective: 'Learn how AI distinguishes between small 3-wheeled vehicles and large buses.',
    level: 1,
    annotation_type: 'IMAGE',
    difficulty: 'EASY',
    dataset_context: 'Abuja & Kano Urban Mobility',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      alt: 'Keke Napep commercial tricycle in Nigeria',
      category: 'Transportation',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'African Mobility Dataset',
    },
    instructions: 'Draw a bounding box around the Keke Napep tricycle and tag it with "Keke Napep".',
    availableLabels: ['Keke Napep', 'Danfo Bus', 'Bicycle', 'Car'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'gt_2', x: 0.28, y: 0.32, width: 0.44, height: 0.50, label: 'Keke Napep' }
      ],
      requiredLabels: ['Keke Napep'],
    },
    xp_reward: 50,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l1_aud_01',
    title: 'Sound Snap: Generator Hum vs Rain',
    description: 'Listen carefully: Is this sound a neighborhood generator hum or rain on a zinc roof?',
    learning_objective: 'Learn acoustic classification and frequency recognition for audio models.',
    level: 1,
    annotation_type: 'AUDIO',
    difficulty: 'EASY',
    dataset_context: 'Naija Acoustic Soundscape Project',
    media_asset: {
      type: 'AUDIO',
      audioSynthType: 'traffic',
      alt: 'Generator motor running in residential compound',
      category: 'Environmental Acoustics',
      media_rights_status: 'ORIGINAL',
      sourceName: 'Naija Acoustic Soundscape Archive',
    },
    instructions: 'Listen to the audio clip and select the correct sound source category.',
    availableLabels: ['Generator Hum', 'Rain on Zinc Roof', 'Traffic Noise', 'Talking Drum'],
    ground_truth: {
      type: 'AUDIO',
      correctSoundClass: 'Generator Hum',
    },
    xp_reward: 50,
    estimated_time_min: 1,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l1_vid_01',
    title: 'Action Tag: Street Vendor Bread Handover',
    description: 'Spot the macro action: Tap when the Agege bread vendor hands over bread to the commuter.',
    learning_objective: 'Learn how video AI identifies physical human-to-human action moments.',
    level: 1,
    annotation_type: 'VIDEO',
    difficulty: 'EASY',
    dataset_context: 'Lagos Street Action Corpus',
    media_asset: {
      type: 'VIDEO',
      videoFrames: [
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      ],
      alt: 'Vendor handing bread through car window',
      category: 'Human Action Recognition',
      media_rights_status: 'ORIGINAL',
      sourceName: 'MLQuest Action Video Collection',
    },
    instructions: 'Mark the frame where the vendor hands over the bread item.',
    availableLabels: ['Handover Item', 'Approaching Vehicle', 'Counting Change'],
    ground_truth: {
      type: 'VIDEO',
      frames: [
        { frameNumber: 1, timeSec: 1.5, boxes: [], actionLabel: 'Approaching Vehicle' },
        { frameNumber: 2, timeSec: 3.0, boxes: [{ id: 'vb_1', x: 0.35, y: 0.30, width: 0.30, height: 0.40, label: 'Handover Item' }], actionLabel: 'Handover Item' },
      ],
      overallAction: 'Handover Item',
    },
    xp_reward: 50,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l1_qa_01',
    title: 'Binary Check: Is this a Suya Grill?',
    description: 'The AI model tagged this food stall as "American Barbecue". Is this AI classification correct?',
    learning_objective: 'Evaluate AI predictions and understand why cultural context matters in computer vision.',
    level: 1,
    annotation_type: 'QA_INSPECTION',
    is_qa_mode: true,
    is_catch_ai_mode: true,
    difficulty: 'EASY',
    dataset_context: 'African Culinary Dataset',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      alt: 'Traditional Nigerian Suya meat on skewer with yaji spice and onions',
      category: 'Catch the AI',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'African Food Heritage Project',
    },
    instructions: 'AI labeled this as "American Barbecue Grill". Review the skewers and seasoning, then tell us if the AI is correct.',
    availableLabels: ['CORRECT', 'WRONG_LABEL'],
    ground_truth: {
      type: 'QA',
      aiProposal: {
        label: 'American Barbecue',
        confidence: 0.89,
      },
      isAiCorrect: false,
      actualErrorType: 'WRONG_LABEL',
      correctedAnswer: 'Nigerian Suya Preparation',
      explanation: 'The AI lacked training on African delicacies. This is traditional Nigerian Suya seasoned with spicy yaji pepper and sliced red onions.',
    },
    xp_reward: 60,
    estimated_time_min: 1,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },

  // --- LEVEL 2: PRECISION BOX (Premium - 75 Quests) ---
  {
    id: 'l2_img_01',
    title: 'Multi-Class Traffic Master (Danfo, Keke, Okada)',
    description: 'Annotate multiple vehicles in traffic: Box Danfos in green, Keke Napeps in yellow, and Okadas in blue.',
    learning_objective: 'Master multi-class object localization and label assignment in dense scenes.',
    level: 2,
    annotation_type: 'IMAGE',
    difficulty: 'MEDIUM',
    dataset_context: 'Third Mainland Bridge Traffic Corpus',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80',
      alt: 'Lagos highway traffic with multiple vehicle types',
      category: 'Transportation',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'Lagos State Smart Mobility',
    },
    instructions: 'Draw separate bounding boxes for each vehicle and tag them accurately.',
    availableLabels: ['Danfo Bus', 'Keke Napep', 'Okada Rider', 'Private Car'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'gt_1', x: 0.15, y: 0.35, width: 0.35, height: 0.45, label: 'Danfo Bus' },
        { id: 'gt_2', x: 0.55, y: 0.40, width: 0.25, height: 0.38, label: 'Keke Napep' },
        { id: 'gt_3', x: 0.82, y: 0.45, width: 0.15, height: 0.32, label: 'Okada Rider' },
      ],
      requiredLabels: ['Danfo Bus', 'Keke Napep', 'Okada Rider'],
    },
    xp_reward: 75,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l2_aud_01',
    title: 'Word-to-Audio Match: Pidgin "No Wahala"',
    description: 'Listen to the audio clip and verify the spoken Pidgin expression transcription.',
    learning_objective: 'Learn speech transcription alignment for African colloquial and indigenous languages.',
    level: 2,
    annotation_type: 'AUDIO',
    difficulty: 'MEDIUM',
    dataset_context: 'NaijaPidgin Voice Benchmark',
    media_asset: {
      type: 'AUDIO',
      audioSynthType: 'market',
      alt: 'Speaker stating "No wahala, we go sort am sharp-sharp"',
      category: 'Speech Annotation',
      media_rights_status: 'ORIGINAL',
      sourceName: 'AfroVoice NLP Consortium',
    },
    instructions: 'Verify if the audio matches "No wahala, we go sort am".',
    availableLabels: ['Exact Match', 'Missing Word', 'Wrong Dialect'],
    ground_truth: {
      type: 'AUDIO',
      correctSoundClass: 'Exact Match',
      transcription: 'No wahala, we go sort am sharp-sharp',
    },
    xp_reward: 75,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l2_vid_01',
    title: 'Event Boundary: Football Kickoff to Goal Shot',
    description: 'Mark the exact start and end timestamps where the striker begins dribbling and takes the shot.',
    learning_objective: 'Understand temporal event boundary segmentation in sports analysis AI.',
    level: 2,
    annotation_type: 'VIDEO',
    difficulty: 'MEDIUM',
    dataset_context: 'Inter-House Sports Video Dataset',
    media_asset: {
      type: 'VIDEO',
      videoFrames: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
      ],
      alt: 'Football player dribbling down pitch',
      category: 'Sports Analytics',
      media_rights_status: 'ORIGINAL',
      sourceName: 'African Youth Sports Archive',
    },
    instructions: 'Set the start timestamp when dribbling starts, and stop timestamp when the ball is struck.',
    availableLabels: ['Dribble Start', 'Shot on Goal', 'Celebration'],
    ground_truth: {
      type: 'VIDEO',
      frames: [
        { frameNumber: 1, timeSec: 1.0, boxes: [], actionLabel: 'Dribble Start' },
        { frameNumber: 2, timeSec: 3.5, boxes: [], actionLabel: 'Shot on Goal' },
      ],
      overallAction: 'Shot on Goal',
    },
    xp_reward: 75,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },

  // --- LEVEL 3: SPOT THE GLITCH (Premium - 100 Quests) ---
  {
    id: 'l3_img_01',
    title: 'Bounding Box Fixer: Tightening Loose Edges (QA)',
    description: 'A junior annotator drew a box that includes 40% empty road around a Danfo bus. Tighten the box.',
    learning_objective: 'Master Intersection over Union (IoU) calibration and precision QA.',
    level: 3,
    annotation_type: 'IMAGE',
    difficulty: 'MEDIUM',
    is_qa_mode: true,
    dataset_context: 'Lagos Smart Transit QA',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80',
      alt: 'Danfo bus with an overly loose draft bounding box',
      category: 'QA & Review',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'Data Reviewer Training Pool',
    },
    instructions: 'Adjust the bounding box edges so it fits snugly with >= 80% IoU accuracy.',
    availableLabels: ['Danfo Bus'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'gt_tight', x: 0.23, y: 0.36, width: 0.50, height: 0.44, label: 'Danfo Bus' }
      ],
      requiredLabels: ['Danfo Bus'],
    },
    xp_reward: 100,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l3_aud_01',
    title: 'Tone & Emotion Tagging: Excited Market Vendor',
    description: 'Listen to the Balogun market seller: Is the vocal tone excited, stern, or calm?',
    learning_objective: 'Train sentiment & emotion detection models to understand African prosody and intonation.',
    level: 3,
    annotation_type: 'AUDIO',
    difficulty: 'MEDIUM',
    dataset_context: 'Balogun Market Audio Corpus',
    media_asset: {
      type: 'AUDIO',
      audioSynthType: 'market',
      alt: 'Market vendor calling out deals with enthusiasm: "Fine fabric, come check am!"',
      category: 'Affective Computing',
      media_rights_status: 'ORIGINAL',
      sourceName: 'West African Speech Archive',
    },
    instructions: 'Listen and select the speaker emotion/tone from the available labels.',
    availableLabels: ['Excited / Energetic', 'Calm / Informative', 'Stern / Frustrated'],
    ground_truth: {
      type: 'AUDIO',
      correctSoundClass: 'Excited / Energetic',
    },
    xp_reward: 100,
    estimated_time_min: 2,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l3_vid_01',
    title: 'Action Phase: Fuel Station Transitions',
    description: 'Annotate 3 sequential phases: Phase 1: Fueling car -> Phase 2: Paying attendant -> Phase 3: Driving out.',
    learning_objective: 'Understand state transition modeling and multi-stage action segmentation.',
    level: 3,
    annotation_type: 'VIDEO',
    difficulty: 'HARD',
    dataset_context: 'Commercial Fleet Analytics',
    media_asset: {
      type: 'VIDEO',
      videoFrames: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
      ],
      alt: 'Vehicle fueling at NNPC retail station',
      category: 'Phase Action Modeling',
      media_rights_status: 'ORIGINAL',
      sourceName: 'Energy Infrastructure Dataset',
    },
    instructions: 'Assign each video segment to its correct procedural phase.',
    availableLabels: ['Phase 1: Fueling', 'Phase 2: Payment', 'Phase 3: Departure'],
    ground_truth: {
      type: 'VIDEO',
      frames: [
        { frameNumber: 1, timeSec: 0.5, boxes: [], actionLabel: 'Phase 1: Fueling' },
        { frameNumber: 2, timeSec: 2.0, boxes: [], actionLabel: 'Phase 2: Payment' },
        { frameNumber: 3, timeSec: 4.0, boxes: [], actionLabel: 'Phase 3: Departure' },
      ],
      overallAction: 'Phase 2: Payment',
    },
    xp_reward: 100,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },

  // --- LEVEL 4: TRACKER TRACK (Premium - 125 Quests) ---
  {
    id: 'l4_img_01',
    title: 'Semantic Part Tagger: Danfo Headlamp vs Side Mirror',
    description: 'Tag sub-attributes and vehicle parts to help fine-grained damage and maintenance detection AI.',
    learning_objective: 'Understand hierarchical and part-level semantic annotation in computer vision.',
    level: 4,
    annotation_type: 'IMAGE',
    difficulty: 'HARD',
    dataset_context: 'Vehicle Telematics & Maintenance AI',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80',
      alt: 'Front close-up of a commercial bus showing headlights and side mirrors',
      category: 'Fine-Grained Parts',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'Lagos Mobility Inspection Lab',
    },
    instructions: 'Draw precise bounding boxes on the Headlamp and Side Mirror.',
    availableLabels: ['Headlamp', 'Side Mirror', 'Windshield', 'Front Grille'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'part_1', x: 0.28, y: 0.55, width: 0.12, height: 0.14, label: 'Headlamp' },
        { id: 'part_2', x: 0.18, y: 0.42, width: 0.08, height: 0.12, label: 'Side Mirror' },
      ],
      requiredLabels: ['Headlamp', 'Side Mirror'],
    },
    xp_reward: 125,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l4_aud_01',
    title: 'Dialect & Slang Validation: Code-Switching Detection',
    description: 'Tag the exact moment a radio speaker switches from Nigerian Standard English to Pidgin: "No wahala".',
    learning_objective: 'Train multilingual NLP models to detect intra-sentential code-switching in speech.',
    level: 4,
    annotation_type: 'AUDIO',
    difficulty: 'HARD',
    dataset_context: 'Nigerian Multilingual Radio Corpus',
    media_asset: {
      type: 'AUDIO',
      audioSynthType: 'bell',
      alt: 'Radio interview with conversational code-switching',
      category: 'Linguistic Code-Switching',
      media_rights_status: 'ORIGINAL',
      sourceName: 'Naija Dialect Research Group',
    },
    instructions: 'Pinpoint the second where the speaker transitions into Nigerian Pidgin.',
    availableLabels: ['English Segment', 'Pidgin Code-Switch', 'Hausa Expression'],
    ground_truth: {
      type: 'AUDIO',
      correctSoundClass: 'Pidgin Code-Switch',
      transcription: 'We discussed the policy, but as my people dey say, no wahala at all.',
    },
    xp_reward: 125,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l4_vid_01',
    title: 'Trajectory & Path Keyframing: Courier Intersection Nav',
    description: 'Track the continuous path of an Okada delivery courier navigating through a 4-way roundabout over 10 seconds.',
    learning_objective: 'Master keyframe interpolation and motion vector estimation in autonomous navigation.',
    level: 4,
    annotation_type: 'VIDEO',
    difficulty: 'HARD',
    dataset_context: 'Lagos Logistics Routing Benchmark',
    media_asset: {
      type: 'VIDEO',
      videoFrames: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594732832278-abd644401426?w=800&auto=format&fit=crop&q=80',
      ],
      alt: 'Okada rider navigating roundabout',
      category: 'Trajectory Keyframing',
      media_rights_status: 'ORIGINAL',
      sourceName: 'African Autonomous Routing Corpus',
    },
    instructions: 'Place keyframe boxes at Frame 1, Frame 2, and Frame 3 to interpolate the courier trajectory.',
    availableLabels: ['Courier Path', 'Traffic Obstacle'],
    ground_truth: {
      type: 'VIDEO',
      frames: [
        { frameNumber: 1, timeSec: 0.0, boxes: [{ id: 'k_1', x: 0.15, y: 0.60, width: 0.18, height: 0.25, label: 'Courier Path' }], actionLabel: 'Enter Roundabout' },
        { frameNumber: 2, timeSec: 2.5, boxes: [{ id: 'k_2', x: 0.45, y: 0.45, width: 0.16, height: 0.22, label: 'Courier Path' }], actionLabel: 'Mid Roundabout' },
        { frameNumber: 3, timeSec: 5.0, boxes: [{ id: 'k_3', x: 0.75, y: 0.30, width: 0.14, height: 0.20, label: 'Courier Path' }], actionLabel: 'Exit Roundabout' },
      ],
      overallAction: 'Courier Path',
    },
    xp_reward: 125,
    estimated_time_min: 4,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },

  // --- LEVEL 5: MASTER EVALUATOR (Premium - 150 Quests) ---
  {
    id: 'l5_img_01',
    title: 'Occlusion & Dense Crowds: Balogun Market Stalls',
    description: 'Annotate partially obscured street traders, umbrellas, and fabric displays in a dense Balogun market scene.',
    learning_objective: 'Handle heavy visual occlusion and overlapping instances in dense urban environments.',
    level: 5,
    annotation_type: 'IMAGE',
    difficulty: 'HARD',
    dataset_context: 'Balogun Dense Commercial Vision Dataset',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      alt: 'Dense Balogun market scene with overlapping colorful fabric stalls and shoppers',
      category: 'Heavy Occlusion',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'Lagos Commercial Heritage Project',
    },
    instructions: 'Annotate the 3 main stalls including partially obscured boundaries behind shoppers.',
    availableLabels: ['Fabric Stall', 'Market Trader', 'Sun Umbrella', 'Pedestrian'],
    ground_truth: {
      type: 'IMAGE',
      boxes: [
        { id: 'occ_1', x: 0.10, y: 0.20, width: 0.38, height: 0.65, label: 'Fabric Stall' },
        { id: 'occ_2', x: 0.42, y: 0.25, width: 0.35, height: 0.60, label: 'Fabric Stall' },
        { id: 'occ_3', x: 0.72, y: 0.30, width: 0.25, height: 0.55, label: 'Market Trader' },
      ],
      requiredLabels: ['Fabric Stall', 'Market Trader'],
    },
    xp_reward: 150,
    estimated_time_min: 4,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l5_aud_01',
    title: 'Audio Quality & Hallucination QA: Lagos Bus Stop Clamor',
    description: 'Identify if the AI speech recognizer hallucinated non-existent words amidst heavy conductor shouts and honking.',
    learning_objective: 'Audit and prevent AI speech hallucination under extreme signal-to-noise ratios.',
    level: 5,
    annotation_type: 'AUDIO',
    difficulty: 'HARD',
    is_qa_mode: true,
    dataset_context: 'Lagos Bus Stop Extreme Noise Corpus',
    media_asset: {
      type: 'AUDIO',
      audioSynthType: 'traffic',
      alt: 'Ojuelegba bus stop ambient audio with conductor calling "Ojuelegba! CMS!"',
      category: 'Speech Hallucination QA',
      media_rights_status: 'ORIGINAL',
      sourceName: 'Acoustic Robustness Research Group',
    },
    instructions: 'The AI model transcribed: "Go into the store and purchase flowers". Is this a hallucination?',
    availableLabels: ['AI Hallucination Detected', 'Accurate Transcription', 'Unintelligible Audio'],
    ground_truth: {
      type: 'QA',
      aiProposal: {
        transcription: 'Go into the store and purchase flowers',
        confidence: 0.74,
      },
      isAiCorrect: false,
      actualErrorType: 'WRONG_TRANSCRIPTION',
      correctedAnswer: 'Ojuelegba! CMS! Enter with your exact 500 Naira change!',
      explanation: 'Under heavy ambient horn noise, standard Western models hallucinate calm phrases. The human specialist correctly identified local conductor calls.',
    },
    xp_reward: 150,
    estimated_time_min: 3,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
  {
    id: 'l5_qa_01',
    title: 'Multi-Modal Validation: Video Motion vs Audio Cues',
    description: 'Verify if the AI-generated caption accurately aligns with both the video visual action and the background talking drum audio.',
    learning_objective: 'Perform state-of-the-art multi-modal alignment and contextual cross-validation.',
    level: 5,
    annotation_type: 'QA_INSPECTION',
    difficulty: 'HARD',
    is_qa_mode: true,
    dataset_context: 'Yoruba Cultural Multimodal Benchmark',
    media_asset: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      alt: 'Traditional cultural dancer at festival with talking drummer accompaniment',
      category: 'Multi-Modal Alignment',
      media_rights_status: 'CREATIVE_COMMONS',
      sourceName: 'African Cultural Heritage Multimedia Corpus',
    },
    instructions: 'AI generated: "A person doing modern hip hop dance in a quiet studio". Review the cultural dress and drum instruments.',
    availableLabels: ['CORRECT', 'WRONG_LABEL', 'MISSING_OBJECT'],
    ground_truth: {
      type: 'QA',
      aiProposal: {
        label: 'Modern Hip Hop in Quiet Studio',
        confidence: 0.94,
      },
      isAiCorrect: false,
      actualErrorType: 'WRONG_LABEL',
      correctedAnswer: 'Traditional Yoruba Festival Dancer with Gangan (Talking Drum) Ensemble',
      explanation: 'The AI completely overlooked the ceremonial Aso-Oke attire and Gangan talking drum rhythm, misattributing it to generic Western hip hop.',
    },
    xp_reward: 150,
    estimated_time_min: 4,
    content_status: 'PUBLISHED',
    safety_status: 'SAFE_FOR_CHILDREN',
  },
];

// =========================================================================
// Deterministic Procedural Dataset Generator
// Populates exactly: Level 1 (20), Level 2 (75), Level 3 (100), Level 4 (125), Level 5 (150)
// =========================================================================

const NIGERIAN_TOPICS = [
  { context: 'Lagos Traffic & Bus Rapid Transit (BRT)', tag: 'lagos_traffic', labels: ['Danfo Bus', 'BRT Bus', 'Keke Napep', 'Okada Rider', 'Traffic Warden'] },
  { context: 'Balogun & Ariaria Open Markets', tag: 'open_market', labels: ['Market Stall', 'Street Vendor', 'Fabric Roll (Ankara)', 'Shopper', 'POS Machine'] },
  { context: 'Nigerian Street Food & Cuisine', tag: 'cuisine', labels: ['Jollof Rice Pot', 'Suya Skewer', 'Pounded Yam Bowl', 'Plantain (Dodo)', 'Agege Bread'] },
  { context: 'Inter-House Sports & Street Football', tag: 'sports', labels: ['Football Player', 'Goalkeeper', 'Referee Whistle', 'Sprinter', 'Goal Post'] },
  { context: 'African Acoustic & Multilingual Soundscape', tag: 'soundscape', labels: ['Generator Hum', 'Rain on Zinc', 'Talking Drum (Gangan)', 'Molue Call', 'Church Bell'] },
  { context: 'Urban Technology & Renewable Solar', tag: 'clean_tech', labels: ['Solar Panel Array', 'Inverter Battery', 'POS Terminal', 'Smartphone Charger', 'Street Light'] },
  { context: 'Cultural Textiles & Traditional Festivals', tag: 'culture', labels: ['Adire Cloth', 'Aso-Oke Headdress', 'Beaded Crown', 'Festival Dancer', 'Calabash Bowl'] },
  { context: 'Agricultural Harvesting & Rural Farming', tag: 'agritech', labels: ['Cocoa Pod', 'Cassava Tuber', 'Oil Palm Bunch', 'Farmer Tractor', 'Yam Heap'] },
];

const LEVEL_CONFIGS: Record<LevelNumber, { quota: number; mechanic: string; defaultXp: number }> = {
  1: { quota: 20, mechanic: 'Snap Tag', defaultXp: 50 },
  2: { quota: 75, mechanic: 'Precision Box', defaultXp: 75 },
  3: { quota: 100, mechanic: 'Spot the Glitch', defaultXp: 100 },
  4: { quota: 125, mechanic: 'Tracker Track', defaultXp: 125 },
  5: { quota: 150, mechanic: 'Master Evaluator', defaultXp: 150 },
};

function generateFullQuotaCatalog(): Quest[] {
  const result: Quest[] = [...CURATED_QUESTS];

  // For each level, fill up to exact quota target
  ([1, 2, 3, 4, 5] as LevelNumber[]).forEach((lvl) => {
    const existingCount = result.filter(q => q.level === lvl).length;
    const targetQuota = LEVEL_CONFIGS[lvl].quota;
    const needed = Math.max(0, targetQuota - existingCount);

    const modalities: AnnotationType[] = ['IMAGE', 'AUDIO', 'VIDEO', 'TEXT', 'QA_INSPECTION'];

    for (let i = 0; i < needed; i++) {
      const idx = existingCount + i + 1;
      const topic = NIGERIAN_TOPICS[i % NIGERIAN_TOPICS.length];
      const modality = modalities[i % modalities.length];
      const qId = `l${lvl}_gen_${modality.toLowerCase()}_${String(idx).padStart(3, '0')}`;

      const isQA = modality === 'QA_INSPECTION' || lvl >= 3;
      const primaryLabel = topic.labels[i % topic.labels.length];

      const quest: Quest = {
        id: qId,
        title: `${topic.context} #${idx}`,
        description: `Level ${lvl} ${LEVEL_CONFIGS[lvl].mechanic} quest focused on ${primaryLabel.toLowerCase()} in ${topic.context.toLowerCase()}.`,
        learning_objective: `Master ${LEVEL_CONFIGS[lvl].mechanic.toLowerCase()} annotation standards for ${topic.tag}.`,
        level: lvl,
        annotation_type: modality === 'QA_INSPECTION' ? 'QA_INSPECTION' : modality === 'IMAGE' ? 'IMAGE' : modality === 'AUDIO' ? 'AUDIO' : modality === 'VIDEO' ? 'VIDEO' : 'TEXT',
        difficulty: lvl === 1 ? 'EASY' : lvl <= 3 ? 'MEDIUM' : 'HARD',
        dataset_context: topic.context,
        is_qa_mode: isQA,
        is_catch_ai_mode: isQA && (lvl === 4 || lvl === 1),
        media_asset: {
          type: modality === 'AUDIO' ? 'AUDIO' : modality === 'VIDEO' ? 'VIDEO' : modality === 'TEXT' ? 'TEXT' : 'IMAGE',
          url: modality === 'IMAGE' || modality === 'QA_INSPECTION'
            ? 'https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=800&q=80'
            : undefined,
          audioSynthType: modality === 'AUDIO' ? (i % 2 === 0 ? 'traffic' : 'market') : undefined,
          videoFrames: modality === 'VIDEO' ? [
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
          ] : undefined,
          textContent: modality === 'TEXT' ? `"Oga, we don load the ${primaryLabel} for inside motor. Make you check am sharp-sharp!"` : undefined,
          alt: `${primaryLabel} in ${topic.context}`,
          category: topic.context,
          media_rights_status: 'ORIGINAL',
          sourceName: `MLQuest Africa Synthetic ${topic.tag.toUpperCase()} Corpus`,
        },
        instructions: `Apply Level ${lvl} ${LEVEL_CONFIGS[lvl].mechanic} techniques: Identify and tag "${primaryLabel}".`,
        availableLabels: topic.labels,
        ground_truth: modality === 'IMAGE' || modality === 'QA_INSPECTION' ? {
          type: 'IMAGE',
          boxes: [
            { id: `gt_${qId}`, x: 0.20 + (i % 3) * 0.15, y: 0.25 + (i % 2) * 0.15, width: 0.35, height: 0.40, label: primaryLabel }
          ],
          requiredLabels: [primaryLabel],
        } : modality === 'AUDIO' ? {
          type: 'AUDIO',
          correctSoundClass: primaryLabel,
          transcription: `Authentic African acoustic capture of ${primaryLabel}`,
        } : modality === 'VIDEO' ? {
          type: 'VIDEO',
          frames: [
            { frameNumber: 1, timeSec: 1.0, boxes: [], actionLabel: primaryLabel },
            { frameNumber: 2, timeSec: 3.0, boxes: [], actionLabel: primaryLabel },
          ],
          overallAction: primaryLabel,
        } : {
          type: 'TEXT',
          sentiment: 'positive',
          category: topic.context,
        },
        xp_reward: LEVEL_CONFIGS[lvl].defaultXp,
        estimated_time_min: lvl <= 2 ? 2 : 3,
        content_status: 'PUBLISHED',
        safety_status: 'SAFE_FOR_CHILDREN',
        created_by: 'MLQuest Procedural Template Engine',
        created_at: '2026-03-01',
      };

      result.push(quest);
    }
  });

  return result;
}

export const INITIAL_QUESTS: Quest[] = generateFullQuotaCatalog();
