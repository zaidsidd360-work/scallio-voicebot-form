import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const countryCodes = [
	{ code: "+1", name: "USA" },
	{ code: "+91", name: "India" },
	{ code: "+44", name: "UK" },
	{ code: "+61", name: "Australia" },
	{ code: "+49", name: "Germany" },
	{ code: "+81", name: "Japan" },
	{ code: "+33", name: "France" },
	{ code: "+86", name: "China" },
	{ code: "+7", name: "Russia" },
	{ code: "+39", name: "Italy" },
	{ code: "+52", name: "Mexico" },
	{ code: "+27", name: "South Africa" },
	{ code: "+82", name: "South Korea" },
	{ code: "+55", name: "Brazil" },
	{ code: "+31", name: "Netherlands" },
	{ code: "+47", name: "Norway" },
	{ code: "+46", name: "Sweden" },
	{ code: "+34", name: "Spain" },
	{ code: "+41", name: "Switzerland" },
	{ code: "+65", name: "Singapore" },
	{ code: "+62", name: "Indonesia" },
	{ code: "+1", name: "Canada" },
	{ code: "+45", name: "Denmark" },
	{ code: "+351", name: "Portugal" },
	{ code: "+63", name: "Philippines" },
	{ code: "+92", name: "Pakistan" },
	{ code: "+90", name: "Turkey" },
	{ code: "+20", name: "Egypt" },
	{ code: "+30", name: "Greece" },
	{ code: "+53", name: "Cuba" },
	{ code: "+61", name: "New Zealand" },
	{ code: "+880", name: "Bangladesh" },
	{ code: "+32", name: "Belgium" },
	{ code: "+420", name: "Czech Republic" },
	{ code: "+372", name: "Estonia" },
	{ code: "+36", name: "Hungary" },
	{ code: "+353", name: "Ireland" },
	{ code: "+972", name: "Israel" },
	{ code: "+254", name: "Kenya" },
	{ code: "+423", name: "Liechtenstein" },
	{ code: "+352", name: "Luxembourg" },
	{ code: "+377", name: "Monaco" },
	{ code: "+373", name: "Moldova" },
	{ code: "+234", name: "Nigeria" },
	{ code: "+48", name: "Poland" },
	{ code: "+40", name: "Romania" },
	{ code: "+421", name: "Slovakia" },
	{ code: "+386", name: "Slovenia" },
	{ code: "+963", name: "Syria" },
	{ code: "+66", name: "Thailand" },
	{ code: "+971", name: "United Arab Emirates" },
	{ code: "+598", name: "Uruguay" },
	{ code: "+58", name: "Venezuela" },
];

const CountryCodeSelector: React.FC<{ onChange: (code: string) => void }> = ({
	onChange,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<string>("+1");

	const filteredCodes = countryCodes.filter((country) =>
		country.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelect = (code: string) => {
		setSelectedCountry(code);
		onChange(code);
		setSearchTerm(""); // Clear search term on selection
		setIsOpen(false); // Close dropdown
	};

	return (
		<div className="relative w-full">
			<div
				className="border rounded-md cursor-pointer w-full flex items-center justify-between px-4 py-2"
				onClick={() => setIsOpen(!isOpen)}
			>
				{selectedCountry
					? `${
							countryCodes.find(
								(country) => country.code === selectedCountry
							)?.name
					  } (${selectedCountry})`
					: "Select country code"}
				<span>
					<ChevronDown
						className={`${isOpen ? "rotate-180" : "rotate-0"}`}
					/>
				</span>
			</div>
			{isOpen && (
				<div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-52 overflow-y-scroll">
					<input
						type="text"
						placeholder="Search country..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border-b"
					/>
					{filteredCodes.length > 0 ? (
						filteredCodes.map((country) => (
							<div
								key={country.name}
								className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
									country.code === selectedCountry &&
									"bg-blue-100"
								}`}
								onClick={() => handleSelect(country.code)}
							>
								{country.name} ({country.code})
							</div>
						))
					) : (
						<div className="px-4 py-2 text-gray-500">
							No results found
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CountryCodeSelector;
