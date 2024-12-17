import React, { useState } from "react";
import {
	Loader2,
	CheckCircle,
	User,
	Mail,
	Phone,
	Briefcase,
	Send,
} from "lucide-react";
import Airtable from "airtable";
import CountryCodeSelector from "./CountryCodeSelector";

interface FormData {
	name: string;
	email: string;
	phone: string;
	industry: string;
}

const FormComponent: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		industry: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [countryCode, setCountryCode] = useState<string>("+1");

	const base = new Airtable({
		apiKey: import.meta.env.VITE_APP_AIRTABLE_KEY,
	}).base(import.meta.env.VITE_APP_DB_ID || "");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null); // Clear error on change
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const { phone, name, email, industry } = formData;

		const url = "https://api.retellai.com/v2/create-phone-call";

		const body = {
			from_number: "+12192688290",
			to_number: `${countryCode}${phone}`,
			// Change this to new agent ID
			override_agent_id: "agent_b4a388b92a796df4906e41cbd2",
			retell_llm_dynamic_variables: {
				customer_name: name,
				phone: phone,
				email: email,
				business_name: industry,
			},
		};

		// Validate required fields
		if (
			!formData.name ||
			!formData.email ||
			!formData.phone ||
			!formData.industry
		) {
			alert("Please fill out all fields.");
			return;
		}

		// Retrieve phone number usage from localStorage
		const phoneCounts = JSON.parse(
			localStorage.getItem("phoneCounts") || "{}"
		);

		// Check if phone number has been used more than 5 times
		if (phoneCounts[phone] >= 5) {
			setError("Cannot use the same phone number more than 5 times.");
			return;
		}

		// Increment phone number usage
		phoneCounts[phone] = (phoneCounts[phone] || 0) + 1;
		localStorage.setItem("phoneCounts", JSON.stringify(phoneCounts));

		setIsSubmitting(true);
		try {
			// Store data in Airtable
			const table = base("Lead");
			await table.create(
				[
					{
						fields: {
							Name: name,
							Email: email,
							Phone: phone,
							"Business Name": industry,
						},
					},
				],
				(_, records) =>
					records?.forEach((record) => console.log(record.getId()))
			);

			// const phoneCallResponse = await client.call.createPhoneCall({
			// 	from_number: "+12192688290",
			// 	to_number: `+91${phone}`,
			// 	override_agent_id: "agent_b4a388b92a796df4906e41cbd2",
			// 	retell_llm_dynamic_variables: {
			// 		customer_name: name,
			// 		phone: phone,
			// 		email: email,
			// 		business_name: industry,
			// 	},
			// });
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${
						import.meta.env.VITE_APP_RETELL_KEY
					}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			console.log(response);
			setIsSubmitted(true);
		} catch (error) {
			console.error("Submission failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="flex flex-col justify-center items-center h-screen text-center">
				<CheckCircle className="text-green-500 w-16 h-16 mb-4" />
				<h2 className="text-xl font-bold">
					Form Submitted Successfully!
				</h2>
				<p className="text-gray-600 mt-2">
					Thank you for submitting your details. You should be
					receiving a call from our AI agent shortly!
				</p>
			</div>
		);
	}

	return (
		<div className="w-full max-w-2xl h-full mx-auto mt-10 bg-white shadow-lg rounded-lg border border-gray-300 p-6">
			<h1 className="text-2xl font-bold text-center mb-6 text-[#f68b24]">
				Receive a Phone call from Scallio AI agent
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						className=" text-gray-700 font-medium mb-1 flex items-center gap-2"
						htmlFor="name"
					>
						<User className="w-4 h-4 text-[#f68b24]" />
						Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f68b24]"
						required
					/>
				</div>
				<div>
					<label
						className=" text-gray-700 font-medium mb-1 flex items-center gap-2"
						htmlFor="email"
					>
						<Mail className="w-4 h-4 text-[#f68b24]" />
						Email <span className="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f68b24]"
						required
					/>
				</div>
				<div>
					<label
						className=" text-gray-700 font-medium mb-1 flex items-center gap-2"
						htmlFor="phone"
					>
						<Phone className="w-4 h-4 text-[#f68b24]" />
						Phone <span className="text-red-500">*</span>
					</label>
					<div className="flex items-center gap-2">
						<CountryCodeSelector onChange={setCountryCode} />
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f68b24]"
							required
						/>
					</div>
				</div>
				<div>
					<label
						className=" text-gray-700 font-medium mb-1 flex items-center gap-2"
						htmlFor="industry"
					>
						<Briefcase className="w-4 h-4 text-[#f68b24]" />
						Business Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="industry"
						name="industry"
						value={formData.industry}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f68b24]"
						required
					/>
				</div>
				{error && (
					<p className="text-red-500 text-sm font-medium">{error}</p>
				)}
				<button
					type="submit"
					className="w-full bg-[#f68b24] text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<Send className="w-5 h-5" />
							Submit
						</>
					)}
				</button>
			</form>
		</div>
	);
};

export default FormComponent;
