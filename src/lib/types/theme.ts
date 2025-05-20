export interface ThemeColors {
    primary: string;
    success: string;
    error: string;
    text: string;
    background: string;
    border: string;
    disabled: string;
    hover: string;
    card?: string;
    // Button colors
    buttonPrimary?: string;
    buttonPrimaryText?: string;
    buttonDisabled?: string;
    buttonDisabledText?: string;
    buttonError?: string;
    buttonErrorText?: string;
    buttonSuccess?: string;
    buttonSuccessText?: string;
    buttonProcessing?: string;
    buttonProcessingText?: string;
    buttonHover?: string;
}

export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export const defaultTheme: ThemeConfig = {
    light: {
        primary: '#4F7FFF',
        success: '#10B981',
        error: '#DC2626',
        text: '#111827',
        background: '#FFFFFF',
        border: '#E5E7EB',
        disabled: '#9CA3AF',
        hover: '#3B82F6'
    },
    dark: {
        primary: '#4F7FFF',
        success: '#10B981',
        error: '#DC2626',
        text: '#F9FAFB',
        background: '#1F2937',
        border: '#374151',
        disabled: '#6B7280',
        hover: '#3B82F6'
    }
}; 