import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './FeedbackPage.module.css';

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [hover, setHover] = useState(0);

    // Multiple termination reasons
    const [terminationReason, setTerminationReason] = useState(null);

    useEffect(() => {
        // Check for different termination scenarios
        const checkTerminationReasons = () => {
            const state = location.state || {};

            if (state.interviewCompleted) {
                // Successfully completed interview
                return null;
            }

            // Different termination scenarios
            if (state.phoneDetected) {
                return "Phone detected during interview";
            }
            if (state.tabSwitched) {
                return "Tab switching detected";
            }
            if (state.alertLimit) {
                return "Multiple policy violations";
            }

            // Default termination message
            return "Interview terminated due to policy violations";
        };

        const reason = checkTerminationReasons();
        setTerminationReason(reason);
    }, [location.state]);

    // Determine interview status
    const interviewCompleted = location.state?.interviewCompleted || false;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (rating === 0) {
            alert('Please provide a rating');
            return;
        }

        console.log('Feedback Submitted:', {
            rating,
            feedbackText,
            terminationReason
        });

        // TODO: Send feedback to backend
        navigate('/UserDashboard');
    };

    // Mapping rating to descriptive text
    const getRatingDescription = () => {
        switch(rating) {
            case 1: return 'Poor';
            case 2: return 'Below Average';
            case 3: return 'Average';
            case 4: return 'Good';
            case 5: return 'Excellent';
            default: return 'Click to rate';
        }
    };

    return (
        <div className={styles.feedbackContainer}>
            <div className={styles.feedbackWrapper}>
                <div className={styles.iconContainer}>
                    <span className={styles.congratsIcon}>
                        {interviewCompleted ? '🏆' : '⚠️'}
                    </span>
                </div>

                <h2 className={styles.headingText}>
                    {interviewCompleted 
                        ? 'Congratulations!' 
                        : 'Interview Interrupted'}
                </h2>

                <p className={styles.subheadingText}>
                    {interviewCompleted
                        ? 'You have successfully completed the interview. Your performance will be evaluated shortly.'
                        : (terminationReason || 'Your interview was terminated due to policy violations.')}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.ratingSection}>
                        <h3 className={styles.ratingTitle}>
                            {interviewCompleted 
                                ? 'How was your interview experience?' 
                                : 'Rate Your Experience'}
                        </h3>
                        
                        <div className={styles.starContainer}>
                            {[...Array(5)].map((star, index) => {
                                index += 1;
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`
                                            ${styles.starButton} 
                                            ${index <= (hover || rating) ? styles.starFilled : ''}
                                        `}
                                        onClick={() => setRating(index)}
                                        onMouseEnter={() => setHover(index)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        &#9733;
                                    </button>
                                );
                            })}
                        </div>
                        
                        <p className={styles.ratingText}>
                            {rating ? `${getRatingDescription()} (${rating}/5)` : 'Click to rate'}
                        </p>
                    </div>

                    <div className={styles.feedbackTextSection}>
                        <h3>Additional Feedback</h3>
                        <textarea
                            className={styles.feedbackTextarea}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={
                                interviewCompleted
                                    ? "Share your thoughts about the interview experience"
                                    : "Explain your perspective on the interview termination"
                            }
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;