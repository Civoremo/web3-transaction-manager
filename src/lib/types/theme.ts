export interface ThemeTypography {
    fontFamily?: string;
    titleFontSize?: string;
    titleColor?: string;
    subtitleFontSize?: string;
    subtitleColor?: string;
    metadataTitleFontSize?: string;
    metadataTitleColor?: string;
    metadataButtonLabelFontSize?: string;
    metadataButtonLabelColor?: string;
    metadataButtonLabelSuccessColor?: string;
    helpTextFontSize?: string;
    helpTextColor?: string;
    helpRedirectFontSize?: string;
    helpRedirectColor?: string;
    helpRedirectHoverColor?: string;
    socialLinkFontSize?: string;
    socialLinkColor?: string;
    socialLinkButtonBackground?: string;
    successMessageFontSize?: string;
    successMessageColor?: string;
    successRedirectColor?: string;
    successRedirectHoverColor?: string;
}

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
    modalBackground?: string;
    primaryActionButtonBackground?: string;
    primarySuccessButtonBackground?: string;
    disabledButtonBackground?: string;
}

export interface ThemeConfig {
    light: ThemeColors & ThemeTypography;
    dark: ThemeColors & ThemeTypography;
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
        hover: '#3B82F6',
        card: '#EEEFFA',
        buttonPrimary: '#4F7FFF',
        buttonPrimaryText: '#FFFFFF',
        buttonDisabled: 'rgba(79,127,255,0.1)',
        buttonDisabledText: '#FFFFFF',
        buttonError: '#DC2626',
        buttonErrorText: '#FFFFFF',
        buttonSuccess: '#FFFFFF',
        buttonSuccessText: '#64748B',
        buttonProcessing: '#4F7FFF',
        buttonProcessingText: '#FFFFFF',
        buttonHover: '#3B66E5',
        fontFamily: 'inherit',
        titleFontSize: '24px',
        titleColor: '#000000',
        subtitleFontSize: '18px',
        subtitleColor: '#555F81',
        metadataTitleFontSize: '15px',
        metadataTitleColor: '#000000',
        metadataButtonLabelFontSize: '14px',
        metadataButtonLabelColor: '#FFFFFF',
        metadataButtonLabelSuccessColor: '#000000',
        helpTextFontSize: '12px',
        helpTextColor: '#555F81',
        helpRedirectFontSize: '12px',
        helpRedirectColor: '#555F81',
        helpRedirectHoverColor: '#555F81',
        socialLinkFontSize: '15px',
        socialLinkColor: '#000000',
        socialLinkButtonBackground: '#FFFFFF',
        successMessageFontSize: '18px',
        successMessageColor: '#555F81',
        successRedirectColor: '#2e54e8',
        successRedirectHoverColor: '#2e54e8',
        modalBackground: '#FAFAFB',
        primaryActionButtonBackground: '#2B51E8',
        primarySuccessButtonBackground: '#FFFFFF',
        disabledButtonBackground: '#BDC9F8',
    },
    dark: {
        primary: '#4F7FFF',
        success: '#10B981',
        error: '#DC2626',
        text: '#F9FAFB',
        background: '#1F2937',
        border: '#374151',
        disabled: '#6B7280',
        hover: '#3B82F6',
        card: '#EEEFFA',
        buttonPrimary: '#4F7FFF',
        buttonPrimaryText: '#FFFFFF',
        buttonDisabled: 'rgba(79,127,255,0.1)',
        buttonDisabledText: '#FFFFFF',
        buttonError: '#DC2626',
        buttonErrorText: '#FFFFFF',
        buttonSuccess: '#1F2937',
        buttonSuccessText: '#9CA3AF',
        buttonProcessing: '#4F7FFF',
        buttonProcessingText: '#FFFFFF',
        buttonHover: '#3B66E5',
        fontFamily: 'inherit',
        titleFontSize: '24px',
        titleColor: '#FFFFFF',
        subtitleFontSize: '18px',
        subtitleColor: '#AAB8D1',
        metadataTitleFontSize: '15px',
        metadataTitleColor: '#FFFFFF',
        metadataButtonLabelFontSize: '14px',
        metadataButtonLabelColor: '#FFFFFF',
        metadataButtonLabelSuccessColor: '#2B51E8',
        helpTextFontSize: '12px',
        helpTextColor: '#AAB8D1',
        helpRedirectFontSize: '12px',
        helpRedirectColor: '#AAB8D1',
        helpRedirectHoverColor: '#AAB8D1',
        socialLinkFontSize: '15px',
        socialLinkColor: '#FFFFFF',
        socialLinkButtonBackground: '#232946',
        successMessageFontSize: '18px',
        successMessageColor: '#AAB8D1',
        successRedirectColor: '#6C8CFF',
        successRedirectHoverColor: '#AAB8D1',
        modalBackground: '#181A20',
        primaryActionButtonBackground: '#6C8CFF',
        primarySuccessButtonBackground: '#232946',
        disabledButtonBackground: '#3A4668',
    }
}; 