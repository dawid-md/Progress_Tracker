import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase"; // Ensure this path is correct

const schema = yup.object().shape({
    email: yup.string().email('Email must be a valid').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log("User logged in", userCredential);
            navigate('/'); // Redirect to home or dashboard as needed
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Login error", errorCode, errorMessage);
            // Optionally set an error state and display it to the user
        }
    };

    return (
        <>
            <div className="loginDiv">Log in to your account</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Email..." {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}

                <input type="password" placeholder="Password..." {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}

                <input type="submit" value="Log In" />
            </form>
        </>
    );
}
