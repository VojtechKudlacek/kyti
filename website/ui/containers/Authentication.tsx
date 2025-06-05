import { useState } from 'react';
import { AuthButton } from 'ui/primitives/AuthButton';

export function Authentication() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return <AuthButton onClick={() => setIsLoggedIn(!isLoggedIn)} isLoggedIn={isLoggedIn} />;
}
