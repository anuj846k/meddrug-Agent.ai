
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				pharma: {
					50: '#f0f7ff',
					100: '#e0f0fe',
					200: '#bae0fd',
					300: '#7cc8fb',
					400: '#36adf5',
					500: '#0c91e0',
					600: '#0073bf',
					700: '#015b9b',
					800: '#064d81',
					900: '#0a416a',
					950: '#062845',
				},
				coral: {
					50: '#fff1f0',
					100: '#ffe4e1',
					200: '#ffcbc9',
					300: '#ffa6a1',
					400: '#ff7670',
					500: '#ff4943',
					600: '#eb2821',
					700: '#c61c16',
					800: '#a61a15',
					900: '#891b17',
					950: '#4b0806',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"pulse-slow": {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				"fade-in": {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				"fade-out": {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				"slide-in": {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"pulse-slow": "pulse-slow 3s ease-in-out infinite",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"slide-in": "slide-in 0.4s ease-out",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
