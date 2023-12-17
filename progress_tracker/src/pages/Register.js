import { auth } from "../config/firebase";
import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom"

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Email must be a valid').required('Email is required'),
    password: yup.string().min(4, 'Password must be at least 4 characters').max(20, 'Password cannot be more than 20 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirming password is required'),
  });

export default function Register(){
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()

    const onSubmit = async (formData) =>{
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await updateProfile(userCredential.user, {
                displayName: formData.name
            });
            console.log("User signed up and name set in profile");
            navigate('/')
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        }
    }

    return(
        <>
            <div className="registerDiv">Wanna sign up?</div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Full Name..." {...register("name")} />
            {/* <input type="text" placeholder="Full Name..." name="name" ref={register("name").ref} onChange={register("name").onChange} onBlur={register("name").onBlur} /> */}
            {errors.name && <p>{errors.name.message}</p>}

            <input type="text" placeholder="Email..." {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}

            <input type="password" placeholder="Password..." {...register("password")} />
            {errors.password && <p>{errors.password.message}</p>}

            <input type="password" placeholder="Confirm Password..." {...register("confirmPassword")} />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

            <input type="submit" />
            </form>
        </>
    )
}