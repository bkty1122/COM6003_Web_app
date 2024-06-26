import React, { useState } from 'react';
import axios from 'axios';
import styles from './PredictionForm.module.css';

const options = {
    smoke: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    drink: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    background_father: { '0': 'AUSTRIA', '1': 'BRASIL', '2': 'BRAZIL', '3': 'CZECH', '4': 'GERMANY', '5': 'ISRAEL', '6': 'ITALY', '7': 'NETHERLANDS', '8': 'POLAND', '9': 'POMERANIA', '10': 'PORTUGAL', '11': 'SPAIN', '-1': 'Unknown' },
    background_mother: { '0': 'BRAZIL', '1': 'FRANCE', '2': 'GERMANY', '3': 'ITALY', '4': 'NETHERLANDS', '5': 'NORWAY', '6': 'POLAND', '7': 'POMERANIA', '8': 'PORTUGAL', '9': 'SPAIN', '-1': 'Unknown' },
    pesticide: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    gender: { '0': 'FEMALE', '1': 'MALE', '-1': 'Unknown' },
    skin_cancer_history: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    cancer_history: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    has_piped_water: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    has_sewage_system: { '0': 'False', '1': 'True', '-1': 'Unknown' },
    grew: { '0': 'FALSE', '1': 'TRUE', '-1': 'Unknown' },
    changed: { '0': 'FALSE', '1': 'TRUE', '-1': 'Unknown' }
};

function PredictionForm() {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        smoke: '-1',
        drink: '-1',
        background_father: '-1',
        background_mother: '-1',
        pesticide: '-1',
        gender: '-1',
        skin_cancer_history: '-1',
        cancer_history: '-1',
        has_piped_water: '-1',
        has_sewage_system: '-1',
        grew: '-1',
        changed: '-1'
        });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = new FormData();

        // Append image if it exists
        if (image) {
            formPayload.append('image', image);
        }

        // Append other form data
        Object.keys(formData).forEach(key => {
            formPayload.append(key, formData[key]);
        });

        try {
            const response = await fetch('https://special-doodle-674g9p6gp5qcrp7r-5000.app.github.dev/predict', {
                method: 'POST',
                body: formPayload,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            alert(`Prediction: ${data.prediction}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit form: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formField}>
                <label className={styles.label}>Image:</label>
                <input type="file" accept="image/png" onChange={handleImageChange} className={styles.input} />
            </div>
            {Object.keys(formData).map(key => (
                <div className={styles.formField} key={key}>
                    <label className={styles.label}>{key.replace(/_/g, ' ')}:</label>
                    <select className={styles.select} name={key} value={formData[key]} onChange={handleInputChange}>
                        {Object.entries(options[key]).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            ))}
            <button type="submit" className={styles.button}>Submit</button>
        </form>
    );
}

export default PredictionForm;