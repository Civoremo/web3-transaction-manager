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
    socialLinkHoverBackground?: string;
    socialLinkHoverBorderColor?: string;
    socialLinkHoverTextColor?: string;
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
    modalBorderColor?: string;
    modalBackdropBlur?: number;
    primaryActionButtonBackground?: string;
    primarySuccessButtonBackground?: string;
    disabledButtonBackground?: string;
}
export interface ThemeConfig {
    light: ThemeColors & ThemeTypography;
    dark: ThemeColors & ThemeTypography;
}
export declare const defaultTheme: ThemeConfig;
export type TransactionType = 'approval' | 'contract' | 'fetch' | 'standard';
export interface Transaction {
    id: string;
    type: TransactionType;
    params: {
        to?: string;
        data?: string;
        value?: string;
        url?: string;
        method?: string;
        body?: any;
        headers?: Record<string, string>;
    };
    metadata: {
        title: string;
        buttonLabel: string;
        description?: string;
    };
}
