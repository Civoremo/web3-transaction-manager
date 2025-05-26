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
export declare const defaultTheme: ThemeConfig;
