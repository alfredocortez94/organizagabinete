
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
			fontFamily: {
				sans: [
					"SF Pro Display",
					"SF Pro",
					"-apple-system",
					"BlinkMacSystemFont",
					"system-ui",
					"Segoe UI",
					"Roboto",
					"Ubuntu",
					"sans-serif"
				],
			},
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				status: {
					pending: '#FF9500',
					approved: '#30D158',
					rejected: '#FF453A',
					completed: '#0A84FF',
					cancelled: '#8E8E93'
				},
				apple: {
					blue: '#0A84FF',
					green: '#30D158', 
					red: '#FF453A',
					orange: '#FF9F0A',
					purple: '#BF5AF2',
					yellow: '#FFD60A',
					gray: '#8E8E93',
					background: '#F5F5F7',
					card: '#FFFFFF'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'apple': '0 4px 24px -6px rgba(0, 0, 0, 0.12)',
				'apple-dark': '0 4px 24px -6px rgba(0, 0, 0, 0.25)',
				'apple-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.15)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-left': {
					from: {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.85',
						transform: 'scale(1.02)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-1000px 0',
					},
					'100%': {
						backgroundPosition: '1000px 0',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.5s ease-out forwards',
				'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
				'float': 'float 5s infinite ease-in-out',
				'shimmer': 'shimmer 2s infinite linear'
			}
		}
	},
	plugins: [tailwindcssAnimate]
} satisfies Config;
