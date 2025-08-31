// ExpertUpload.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './ExpertUpload.module.css';

const ExpertUpload = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [selectedJobPost, setSelectedJobPost] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch job posts for the expert
        const fetchJobPosts = async () => {
            const response = await axios.get('http://127.0.0.1:8000/admin-dashboard/list-job-posts/');
            setJobPosts(response.data);
        };

        fetchJobPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('questions_csv', csvFile);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/expert-dashboard/upload-job-post-csv/${selectedJobPost}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setLoading(false);
        } catch (error) {
            setMessage(error.response.data.error);
            setLoading(false);
        }
    };

    return (
        <div className={styles.expertUploadContainer}>
            <h2 className={styles.title}>Generate Questions for Job Post</h2>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <div className={styles.selectContainer}>
                    <label className={styles.label}>Select Job Post:</label>
                    <select
                        className={styles.select}
                        onChange={(e) => setSelectedJobPost(e.target.value)}
                        required
                        value={selectedJobPost}
                    >
                        <option value="">Select Job Post</option>
                        {jobPosts.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.fileContainer}>
                    <label className={styles.label}>Select File:</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                        required
                        className={styles.fileInput}
                    />
                </div>
                <button
                    type="submit"
                    className={`${styles.submitButton} ${loading ? styles.loading : ''}`}

                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Upload file'}
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};


export default ExpertUpload;