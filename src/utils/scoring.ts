import { 
  BoundingBox, 
  GroundTruth, 
  GroundTruthImage, 
  GroundTruthText, 
  GroundTruthAudio, 
  GroundTruthVideo, 
  GroundTruthQA,
  EvaluationResult,
  QAErrorType
} from '../types';

/**
 * Computes Intersection over Union (IoU) between two normalized 2D bounding boxes.
 * Box coordinates are in [0, 1] range: {x, y, width, height}.
 */
export function calculateIoU(boxA: BoundingBox, boxB: BoundingBox): number {
  const ax1 = boxA.x;
  const ay1 = boxA.y;
  const ax2 = boxA.x + boxA.width;
  const ay2 = boxA.y + boxA.height;

  const bx1 = boxB.x;
  const by1 = boxB.y;
  const bx2 = boxB.x + boxB.width;
  const by2 = boxB.y + boxB.height;

  // Intersection coordinates
  const interX1 = Math.max(ax1, bx1);
  const interY1 = Math.max(ay1, by1);
  const interX2 = Math.min(ax2, bx2);
  const interY2 = Math.min(ay2, by2);

  const interWidth = Math.max(0, interX2 - interX1);
  const interHeight = Math.max(0, interY2 - interY1);
  const intersectionArea = interWidth * interHeight;

  const areaA = boxA.width * boxA.height;
  const areaB = boxB.width * boxB.height;
  const unionArea = areaA + areaB - intersectionArea;

  if (unionArea <= 0) return 0;
  return intersectionArea / unionArea;
}

/**
 * Evaluates Image Bounding Box annotations against Ground Truth.
 */
export function evaluateImageAnnotation(
  userBoxes: BoundingBox[],
  groundTruth: GroundTruthImage
): EvaluationResult {
  const gtBoxes = groundTruth.boxes;
  
  if (gtBoxes.length === 0) {
    const isSuccess = userBoxes.length === 0;
    return {
      questId: '',
      accuracy: isSuccess ? 100 : 0,
      isSuccess,
      scoreGrade: isSuccess ? 'EXCELLENT' : 'NEEDS_PRACTICE',
      xpEarned: isSuccess ? 50 : 10,
      feedbackTitle: isSuccess ? 'Spot On!' : 'Careful!',
      feedbackMessage: isSuccess 
        ? 'Great observation! There were indeed no target objects in this sample.' 
        : 'There were no target objects here, but extra boxes were drawn.',
      educationalTakeaway: 'In real AI, recognizing when an object is ABSENT is just as important as finding it (reducing False Positives).',
      groundTruthData: groundTruth
    };
  }

  if (userBoxes.length === 0) {
    return {
      questId: '',
      accuracy: 0,
      isSuccess: false,
      scoreGrade: 'NEEDS_PRACTICE',
      xpEarned: 5,
      feedbackTitle: 'No Boxes Drawn Yet',
      feedbackMessage: `Try drawing bounding boxes around the target objects: ${groundTruth.requiredLabels.join(', ')}.`,
      educationalTakeaway: 'AI models rely on bounding box coordinates (x, y, width, height) to know the exact physical location of objects in an image.',
      groundTruthData: groundTruth
    };
  }

  // Greedy match each ground truth box with user box with highest IoU and matching label
  const matchedUserIndices = new Set<number>();
  let totalIoU = 0;
  let matchesCount = 0;
  let correctLabelMatches = 0;

  for (const gt of gtBoxes) {
    let bestIoU = 0;
    let bestUserIdx = -1;

    for (let i = 0; i < userBoxes.length; i++) {
      if (matchedUserIndices.has(i)) continue;
      const userBox = userBoxes[i];
      const iou = calculateIoU(gt, userBox);
      if (iou > bestIoU) {
        bestIoU = iou;
        bestUserIdx = i;
      }
    }

    if (bestUserIdx !== -1 && bestIoU >= 0.25) {
      matchedUserIndices.add(bestUserIdx);
      totalIoU += bestIoU;
      matchesCount++;
      if (userBoxes[bestUserIdx].label.toLowerCase().trim() === gt.label.toLowerCase().trim()) {
        correctLabelMatches++;
      }
    }
  }

  const averageIoU = matchesCount > 0 ? (totalIoU / gtBoxes.length) : 0;
  const coverageRatio = matchesCount / gtBoxes.length;
  const extraBoxesPenalty = Math.max(0, userBoxes.length - gtBoxes.length) * 0.15;
  const labelAccuracyRatio = gtBoxes.length > 0 ? (correctLabelMatches / gtBoxes.length) : 0;

  // Composite accuracy score
  let accuracyScore = Math.round(
    (averageIoU * 0.5 + coverageRatio * 0.3 + labelAccuracyRatio * 0.2 - extraBoxesPenalty) * 100
  );
  accuracyScore = Math.max(0, Math.min(100, accuracyScore));

  const isSuccess = accuracyScore >= 60;
  let grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_PRACTICE' = 'NEEDS_PRACTICE';
  let feedbackTitle = 'Let\'s Refine Your Bounding Box!';
  let feedbackMessage = 'Try making the box fit snugly around the object without leaving too much extra space or clipping edges.';

  if (accuracyScore >= 80) {
    grade = 'EXCELLENT';
    feedbackTitle = 'Outstanding Precision!';
    feedbackMessage = `Your boxes fit snugly with an average IoU of ${Math.round(averageIoU * 100)}%! Clean bounding boxes teach computer vision models to locate objects perfectly.`;
  } else if (accuracyScore >= 60) {
    grade = 'GOOD';
    feedbackTitle = 'Great Job, Annotator!';
    feedbackMessage = `Good detection! With an IoU score of ${Math.round(averageIoU * 100)}%, your annotation captured the target well.`;
  }

  const xpEarned = isSuccess ? (accuracyScore >= 80 ? 60 : 40) : 15;

  return {
    questId: '',
    accuracy: accuracyScore,
    isSuccess,
    scoreGrade: grade,
    xpEarned,
    feedbackTitle,
    feedbackMessage,
    educationalTakeaway: 'Intersection over Union (IoU) measures how well your drawn box overlaps with the true location of the object. High IoU means cleaner training data for computer vision!',
    iouScore: Math.round(averageIoU * 100),
    groundTruthData: groundTruth
  };
}

/**
 * Evaluates Text Classification & Entity Labeling against Ground Truth.
 */
export function evaluateTextAnnotation(
  userSelection: { sentiment?: string; category?: string; selectedSpans?: Array<{ start: number; end: number; label: string }> },
  groundTruth: GroundTruthText
): EvaluationResult {
  let score = 0;
  let totalPoints = 0;
  let feedbackMsg = '';

  if (groundTruth.sentiment) {
    totalPoints += 100;
    if (userSelection.sentiment?.toLowerCase() === groundTruth.sentiment.toLowerCase()) {
      score += 100;
      feedbackMsg = `Correct sentiment! The tone is indeed "${groundTruth.sentiment}". `;
    } else {
      feedbackMsg = `The true tone was "${groundTruth.sentiment}", but you selected "${userSelection.sentiment || 'None'}". `;
    }
  }

  if (groundTruth.category) {
    totalPoints += 100;
    if (userSelection.category?.toLowerCase() === groundTruth.category.toLowerCase()) {
      score += 100;
      feedbackMsg += `Correct topic category! `;
    }
  }

  const finalAccuracy = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 100;
  const isSuccess = finalAccuracy >= 70;

  return {
    questId: '',
    accuracy: finalAccuracy,
    isSuccess,
    scoreGrade: finalAccuracy >= 85 ? 'EXCELLENT' : finalAccuracy >= 60 ? 'GOOD' : 'NEEDS_PRACTICE',
    xpEarned: isSuccess ? 50 : 15,
    feedbackTitle: isSuccess ? 'Language Mastered!' : 'Tone Detective Challenge',
    feedbackMessage: feedbackMsg,
    educationalTakeaway: 'Natural Language Processing (NLP) models learn context and emotion by analyzing human-labeled sentences in local contexts like Nigerian Pidgin, Yoruba, Igbo, and Hausa.',
    groundTruthData: groundTruth
  };
}

/**
 * Evaluates Audio Sound Classification & Transcription verification.
 */
export function evaluateAudioAnnotation(
  userSoundClass: string,
  groundTruth: GroundTruthAudio
): EvaluationResult {
  const isCorrect = userSoundClass.toLowerCase().trim() === groundTruth.correctSoundClass.toLowerCase().trim();
  const accuracy = isCorrect ? 100 : 30;

  return {
    questId: '',
    accuracy,
    isSuccess: isCorrect,
    scoreGrade: isCorrect ? 'EXCELLENT' : 'NEEDS_PRACTICE',
    xpEarned: isCorrect ? 50 : 15,
    feedbackTitle: isCorrect ? 'Sharp Ears!' : 'Listen Closely',
    feedbackMessage: isCorrect
      ? `Spot on! You correctly identified the sound as "${groundTruth.correctSoundClass}".`
      : `You selected "${userSoundClass}", but the actual audio waveform is "${groundTruth.correctSoundClass}".`,
    educationalTakeaway: 'Audio AI systems convert sound waves into spectrogram frequencies to classify environmental sounds, music, and speech accents.',
    groundTruthData: groundTruth
  };
}

/**
 * Evaluates Video Tracking across frames.
 */
export function evaluateVideoAnnotation(
  userFrameBoxes: Record<number, BoundingBox>,
  groundTruth: GroundTruthVideo
): EvaluationResult {
  let totalIoU = 0;
  let evaluatedFrames = 0;

  for (const frame of groundTruth.frames) {
    const userBox = userFrameBoxes[frame.frameNumber];
    const gtBox = frame.boxes[0];
    if (userBox && gtBox) {
      const iou = calculateIoU(userBox, gtBox);
      totalIoU += iou;
      evaluatedFrames++;
    } else if (gtBox) {
      evaluatedFrames++;
    }
  }

  const averageIoU = evaluatedFrames > 0 ? (totalIoU / evaluatedFrames) : 0;
  const accuracy = Math.round(averageIoU * 100);
  const isSuccess = accuracy >= 50;

  return {
    questId: '',
    accuracy,
    isSuccess,
    scoreGrade: accuracy >= 75 ? 'EXCELLENT' : accuracy >= 50 ? 'GOOD' : 'NEEDS_PRACTICE',
    xpEarned: isSuccess ? 60 : 20,
    feedbackTitle: isSuccess ? 'Smooth Tracking!' : 'Object Tracking Challenge',
    feedbackMessage: isSuccess
      ? `Great tracking consistency! You followed the trajectory across video frames with ${accuracy}% overlap.`
      : `Temporal tracking requires keeping the box centered on the moving object across each frame.`,
    educationalTakeaway: 'Video models process sequences of images across time (temporal dimension) to understand actions, vehicle speed, and sport trajectories.',
    iouScore: accuracy,
    groundTruthData: groundTruth
  };
}

/**
 * Evaluates QA Inspector / "Catch AI" decisions.
 */
export function evaluateQAInspection(
  userSaidCorrect: boolean,
  userSelectedErrorType: QAErrorType | undefined,
  groundTruth: GroundTruthQA
): EvaluationResult {
  const aiWasActuallyCorrect = groundTruth.isAiCorrect;
  let accuracy = 0;
  let feedbackMessage = '';

  if (userSaidCorrect === aiWasActuallyCorrect) {
    if (aiWasActuallyCorrect) {
      accuracy = 100;
      feedbackMessage = 'Excellent judgment! The AI annotation was indeed accurate and met gold quality standards.';
    } else {
      // AI had an error. Did the user catch the correct error type?
      if (userSelectedErrorType === groundTruth.actualErrorType) {
        accuracy = 100;
        feedbackMessage = `Brilliant inspection! You caught the exact AI mistake: "${groundTruth.actualErrorType}".`;
      } else {
        accuracy = 70;
        feedbackMessage = `You rightly noticed AI made a mistake! The specific error type was "${groundTruth.actualErrorType}".`;
      }
    }
  } else {
    accuracy = 25;
    feedbackMessage = aiWasActuallyCorrect
      ? 'The AI prediction was actually correct in this case. High quality assurance also means verifying correct labels!'
      : `The AI actually made a mistake here (${groundTruth.actualErrorType}). ${groundTruth.explanation}`;
  }

  const isSuccess = accuracy >= 65;

  return {
    questId: '',
    accuracy,
    isSuccess,
    scoreGrade: accuracy >= 85 ? 'EXCELLENT' : accuracy >= 60 ? 'GOOD' : 'NEEDS_PRACTICE',
    xpEarned: isSuccess ? 60 : 15,
    feedbackTitle: isSuccess ? 'AI Inspector Badge Worthy!' : 'Quality Assurance Inspection',
    feedbackMessage,
    educationalTakeaway: 'Human-in-the-Loop (HITL) Quality Assurance is essential because AI models often hallucinate or confuse visually similar objects.',
    groundTruthData: groundTruth
  };
}

/**
 * Universal evaluation dispatcher for any quest submission.
 */
export function evaluateSubmission(
  quest: {
    id: string;
    annotation_type: string;
    ground_truth?: any;
    ground_truth_qa?: GroundTruthQA;
    xp_reward?: number;
  },
  submission: {
    boxes?: BoundingBox[];
    selectedLabel?: string;
    sentiment?: string;
    category?: string;
    frameBoxes?: Record<number, BoundingBox>;
    userSaidCorrect?: boolean;
    errorType?: QAErrorType;
    correctedAnswer?: string;
  }
): EvaluationResult {
  let res: EvaluationResult;

  if (quest.annotation_type === 'IMAGE_BOUNDING_BOX' || quest.annotation_type === 'IMAGE') {
    const gt = quest.ground_truth || { type: 'IMAGE', boxes: [], requiredLabels: [] };
    res = evaluateImageAnnotation(submission.boxes || [], gt);
  } else if (quest.annotation_type === 'TEXT_SENTIMENT' || quest.annotation_type === 'TEXT') {
    const gt = quest.ground_truth || { type: 'TEXT', sentiment: 'positive' };
    res = evaluateTextAnnotation({ sentiment: submission.sentiment, category: submission.category }, gt);
  } else if (quest.annotation_type === 'AUDIO_CLASSIFICATION' || quest.annotation_type === 'AUDIO') {
    const gt = quest.ground_truth || { type: 'AUDIO', correctSoundClass: submission.selectedLabel || '' };
    res = evaluateAudioAnnotation(submission.selectedLabel || '', gt);
  } else if (quest.annotation_type === 'VIDEO_TRACKING' || quest.annotation_type === 'VIDEO') {
    const gt = quest.ground_truth || { type: 'VIDEO', frames: [] };
    res = evaluateVideoAnnotation(submission.frameBoxes || {}, gt);
  } else if (quest.annotation_type === 'QA_INSPECTION' || quest.ground_truth_qa) {
    const gt = quest.ground_truth_qa || (quest.ground_truth as GroundTruthQA);
    res = evaluateQAInspection(submission.userSaidCorrect ?? true, submission.errorType, gt);
  } else {
    res = {
      questId: quest.id,
      accuracy: 100,
      isSuccess: true,
      scoreGrade: 'EXCELLENT',
      xpEarned: quest.xp_reward || 50,
      feedbackTitle: 'Great Job!',
      feedbackMessage: 'Annotation processed successfully.',
      educationalTakeaway: 'Every verified piece of data helps train more reliable machine learning models.',
    };
  }

  res.questId = quest.id;
  res.passed = res.isSuccess;
  res.score = res.accuracy;
  res.feedback = res.feedbackMessage;
  res.earnedXp = res.xpEarned;

  return res;
}
