import { outlet } from '../instances';

export async function refreshOutletState() {
	await outlet.fetchState();
}
