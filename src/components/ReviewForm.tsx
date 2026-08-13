import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import type { Review } from "../pages/MovieDetailsPage";

interface ReviewFormProps {
    createReview: (text: string, rating: number) => Promise<boolean>;
    updateReview: (id: number, text: string, rating: number) => Promise<boolean>;
    setFormType?: (type: string | null) => void;
    formType?: 'create' | 'update';
    initialReview: Review | null;
}

interface ErrorReview {
    text?: string;
    rating?: string;
}

function ReviewForm ({ createReview, updateReview, setFormType, formType, initialReview }: ReviewFormProps) {

    const [text, setText] = useState('');
    const [rating, setRating] = useState(1);

    const [errors, setErrors] = useState<ErrorReview>({});

    const validationSchema = Yup.object({
        text: Yup.string()
            .required('Fyll i recensionstext!')
            .min(5, 'Recensionstext måste vara minst 5 tecken'),
        rating: Yup.number()
            .min(1, 'Betyg skall vara minst 1')
            .max(5, 'Betyg skall vara max 5')
    });

    useEffect(() => {
        if(formType === 'update' && initialReview) {
            setText(initialReview.text);
            setRating(initialReview.rating);
        }
    }, [formType, initialReview]); 

    async function handleSubmit(event: React.FormEvent) { 
        
        event.preventDefault();

        let success = false;

        try {
            await validationSchema.validate({ text, rating}, { abortEarly: false});

            if(formType === 'create') {

                success = await createReview(text, rating);
            }

            if(formType === 'update' && initialReview) {
                success = await updateReview(initialReview.id, text, rating)
            }

            if(setFormType && success) {
                setFormType(null);
            }
        } catch (errors) {
            const validationErrors: ErrorReview = {};

            if(errors instanceof Yup.ValidationError) {
                errors.inner.forEach((error) => {
                    const prop = error.path as keyof ErrorReview;
                    validationErrors[prop] = error.message;
                });
            }

            setErrors(validationErrors);
        }
        
    }

    return(
        <fieldset>
            <legend>{formType === 'create' ? 'Skriv recension': 'Redigera recension'}</legend>
            <form onSubmit={handleSubmit}>
                <label htmlFor="text">Text:</label>
                <textarea 
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                ></textarea>
                
                {errors.text && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.text}</span>}

                <br />

                <label htmlFor="rating">Betyg (1-5):</label>
                <select name="rating" id="rating"
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                >
                    {
                        [1, 2, 3, 4, 5].map((number) => (
                            <option value={number} key={number}>{number}
                            </option>
                        ))
                    }
                </select>
                
                {errors.rating && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.rating}</span>}

                {
                    setFormType && (
                        <>
                        <button type="submit">
                            {formType === 'create' ? 'Publicera': 'Spara'}
                        </button>
                        <button onClick={() => setFormType(null)}>Avbryt</button>
                        </>
                    )
                }
            </form>
        </fieldset>
    )
}

export default ReviewForm;