import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { useEffect } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

export function ScoreRing({ score, size = 160, strokeWidth = 3, label = 'K0RE SCORE' }: ScoreRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(score / 100, { duration: 1500 });
    }, [score]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.gold}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                    animatedProps={animatedProps}
                />

                {/* Score Text */}
                <SvgText
                    x={size / 2}
                    y={size / 2 - 5}
                    textAnchor="middle"
                    fontSize={size / 3.5}
                    fontWeight="300"
                    fill={colors.white}
                    letterSpacing={-2}
                >
                    {score}
                </SvgText>

                {/* Label Text */}
                <SvgText
                    x={size / 2}
                    y={size / 2 + 17}
                    textAnchor="middle"
                    fontSize={8}
                    fontWeight="600"
                    fill={colors.silver}
                    letterSpacing={2}
                >
                    {label}
                </SvgText>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
