import type { LoginItem } from "@/types/vault";
import { useFormContext } from "react-hook-form";

export function CreateLoginItem() {
	const {
		register,
		formState: { errors },
	} = useFormContext<LoginItem>();

	return (
		<div>
			<label htmlFor="url">
				URL:
				<input {...register("url")} placeholder="URL" />
				{errors.url && <p className="error">{errors.url.message}</p>}
			</label>
			<br />
			<label htmlFor="username">
				Username:
				<input {...register("username")} placeholder="Username" />
				{errors.username && (
					<p className="error">{errors.username.message}</p>
				)}
			</label>
			<br />
			<label htmlFor="password">
				Password:
				<input {...register("password")} placeholder="Password" />
				{errors.password && (
					<p className="error">{errors.password.message}</p>
				)}
			</label>
		</div>
	);
}
