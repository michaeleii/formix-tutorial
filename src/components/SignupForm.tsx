import { Form, Formik, useField } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const formSchema = z.object({
	firstName: z
		.string({ required_error: "Required" })
		.min(1)
		.max(15, { message: "First name must be less than 15 characters" }),
	lastName: z
		.string({
			required_error: "Required",
		})
		.min(1)
		.max(20, { message: "Last name must be less than 20 characters" }),
	email: z
		.string({
			required_error: "Required",
		})
		.email({
			message: "Please enter a valid email address",
		}),
	acceptedTerms: z.boolean({
		required_error: "You must accept the terms and conditions",
	}),
	jobType: z.enum(["designer", "development", "product", "other"], {
		required_error: "Please select a job type",
	}),
});

type MyTextInputProps = {
	label: string;
	name: string;
	type: string;
	placeholder: string;
};

const MyTextInput = ({ label, ...props }: MyTextInputProps) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input>. We can use field meta to show an error
	// message if the field is invalid and it has been touched (i.e. visited)
	const [field, meta] = useField(props);
	return (
		<>
			<label htmlFor={props.name}>{label}</label>
			<input className="text-input" {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</>
	);
};

type MyCheckboxProps = {
	children: React.ReactNode;
	name: string;
};

const MyCheckbox = ({ children, ...props }: MyCheckboxProps) => {
	// React treats radios and checkbox inputs differently other input types, select, and textarea.
	// Formik does this too! When you specify `type` to useField(), it will
	// return the correct bag of props for you -- a `checked` prop will be included
	// in `field` alongside `name`, `value`, `onChange`, and `onBlur`
	const [field, meta] = useField({ ...props, type: "checkbox" });
	return (
		<div>
			<label className="checkbox-input">
				<input type="checkbox" {...field} {...props} />
				{children}
			</label>
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

type MySelectProps = {
	children: React.ReactNode;
	label: string;
	name: string;
};

const MySelect = ({ label, ...props }: MySelectProps) => {
	const [field, meta] = useField(props);
	return (
		<div>
			<label htmlFor={props.name}>{label}</label>
			<select {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

// And now we can use these
const SignupForm = () => {
	const initialValues = {
		firstName: "",
		lastName: "",
		email: "",
		acceptedTerms: false, // added for our checkbox
		jobType: "", // added for our select
	};
	return (
		<div className="form-container">
			<h1>Register</h1>
			<Formik
				initialValues={initialValues}
				validationSchema={toFormikValidationSchema(formSchema)}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						alert(JSON.stringify(values, null, 2));
						setSubmitting(false);
					}, 400);
				}}
			>
				<Form>
					<MyTextInput
						label="First Name"
						name="firstName"
						type="text"
						placeholder="Jane"
					/>

					<MyTextInput
						label="Last Name"
						name="lastName"
						type="text"
						placeholder="Doe"
					/>

					<MyTextInput
						label="Email Address"
						name="email"
						type="email"
						placeholder="jane@formik.com"
					/>

					<MySelect label="Job Type" name="jobType">
						<option value="">Select a job type</option>
						<option value="designer">Designer</option>
						<option value="development">Developer</option>
						<option value="product">Product Manager</option>
						<option value="other">Other</option>
					</MySelect>

					<MyCheckbox name="acceptedTerms">
						I accept the terms and conditions
					</MyCheckbox>

					<button type="submit">Submit</button>
				</Form>
			</Formik>
		</div>
	);
};
export default SignupForm;
