import { PathCmd } from "./path_parsing.ts";

export type PathAproximationResult = { cmd: PathCmd, start:[number, number], error: number }

export type PathApproximator = (points:[number,number][]) => PathAproximationResult | null

export const PATH_OPT = {

    getFn(cmd: PathCmd, start: [number, number]): ((t: number) => [number, number]) | null {
        // Pas une commande de courbe
        if (cmd.type === 'm' || cmd.type === 'z') return null

        const [sx, sy] = start

        // Ligne absolue
        if (cmd.type === 'l') {
            const [x, y] = cmd.values
            return (t: number) => [
                sx * (1 - t) + x * t,
                sy * (1 - t) + y * t
            ]
        }

        // Ligne horizontale
        if (cmd.type === 'h') {
            const [x] = cmd.values
            return (t: number) => [
                sx * (1 - t) + x * t,
                sy
            ]
        }

        // Ligne verticale
        if (cmd.type === 'v') {
            const [y] = cmd.values
            return (t: number) => [
                sx,
                sy * (1 - t) + y * t
            ]
        }

        // Courbe de Bézier quadratique
        if (cmd.type === 'q') {
            const [x1, y1, x2, y2] = cmd.values
            return (t: number) => {
                const u = 1 - t
                const x = u * u * sx + 2 * u * t * x1 + t * t * x2
                const y = u * u * sy + 2 * u * t * y1 + t * t * y2
                return [x, y]
            }
        }

        // Courbe de Bézier cubique
        if (cmd.type === 'c') {
            const [x1, y1, x2, y2, x3, y3] = cmd.values
            return (t: number) => {
                const u = 1 - t
                const x = u * u * u * sx + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
                const y = u * u * u * sy + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
                return [x, y]
            }
        }

        // Arc elliptique (a rx ry xAxisRot largeArcFlag sweepFlag x y)
        if (cmd.type === 'a') {
            const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, ex, ey] = cmd.values

            // Conversion en radians
            const phi = xAxisRotation * Math.PI / 180

            // Centre des ellipses via méthode de conversion SVG spec
            const dx2 = (sx - ex) / 2
            const dy2 = (sy - ey) / 2

            const cosPhi = Math.cos(phi)
            const sinPhi = Math.sin(phi)

            const x1p = cosPhi * dx2 + sinPhi * dy2
            const y1p = -sinPhi * dx2 + cosPhi * dy2

            let rxAdj = Math.abs(rx)
            let ryAdj = Math.abs(ry)

            const x1p2 = x1p * x1p
            const y1p2 = y1p * y1p

            let lambda = x1p2 / (rxAdj * rxAdj) + y1p2 / (ryAdj * ryAdj)
            if (lambda > 1) {
                const scale = Math.sqrt(lambda)
                rxAdj *= scale
                ryAdj *= scale
            }

            const rx2 = rxAdj * rxAdj
            const ry2 = ryAdj * ryAdj

            const sign = (largeArcFlag !== sweepFlag) ? 1 : -1
            const sq = ((rx2 * ry2) - (rx2 * y1p2) - (ry2 * x1p2)) / ((rx2 * y1p2) + (ry2 * x1p2))
            const coef = sign * Math.sqrt(Math.max(0, sq))

            const cxp = coef * (rxAdj * y1p) / ryAdj
            const cyp = coef * -(ryAdj * x1p) / rxAdj

            const cx = cosPhi * cxp - sinPhi * cyp + (sx + ex) / 2
            const cy = sinPhi * cxp + cosPhi * cyp + (sy + ey) / 2

            const theta = (ux: number, uy: number, vx: number, vy: number) => {
                const dot = ux * vx + uy * vy
                const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy))
                let angle = Math.acos(Math.min(Math.max(dot / len, -1), 1))
                if (ux * vy - uy * vx < 0) angle = -angle
                return angle
            }

            const startAngle = theta(1, 0, (x1p - cxp) / rxAdj, (y1p - cyp) / ryAdj)
            let deltaAngle = theta(
                (x1p - cxp) / rxAdj,
                (y1p - cyp) / ryAdj,
                (-x1p - cxp) / rxAdj,
                (-y1p - cyp) / ryAdj
            )

            if (!sweepFlag && deltaAngle > 0) deltaAngle -= 2 * Math.PI
            else if (sweepFlag && deltaAngle < 0) deltaAngle += 2 * Math.PI

            return (t: number) => {
                const angle = startAngle + t * deltaAngle
                const x = cx + rxAdj * Math.cos(phi) * Math.cos(angle) - ryAdj * Math.sin(phi) * Math.sin(angle)
                const y = cy + rxAdj * Math.sin(phi) * Math.cos(angle) + ryAdj * Math.cos(phi) * Math.sin(angle)
                return [x, y]
            }
        }

        return null
    },

    getPoints(cmd: PathCmd, start: [number,number], count: number): [number,number][]|null{
        const pts: [number, number][] = []
        const vals = cmd.values

        // Get point function
        const fn = this.getFn(cmd, start)
        if(fn === null) return null

        // Create curve
        let curve = [] as [number, number][]
        for(let i = 0; i<count; i++) curve.push(fn(i/(count-1)))

        return pts
    },


    getPointsMany(cmds: PathCmd[], curveStart: [number,number], start: [number,number], count: number = 20): [number, number][] {
        const result: [number, number][] = []

        let lastStart = curveStart
        let current = start

        for (const cmd of cmds) {
            const type = cmd.type

            // Jump
            if (type === 'm') {
                const [x, y] = cmd.values
                current = [x, y]
                lastStart = current
                result.push(current)
                continue
            }

            // Close path
            if (type === 'z') {
                const linePoints = PATH_OPT.getPoints({ type: 'l', values: lastStart }, current, count)
                if (linePoints) {
                    result.push(...linePoints.slice(1)) // éviter doublon du point courant
                    current = linePoints[linePoints.length - 1]
                }
                continue
            }

            const pts = PATH_OPT.getPoints(cmd, current, count)
            if (!pts || pts.length === 0) continue

            result.push(...pts.slice(1)) // éviter de répéter current
            current = pts[pts.length - 1]
        }

        return result
    },

    approximateLine(pts: [number,number][]): { cmd: PathCmd, start:[number, number], error: number }|null {
        if(pts.length<2)return null

        const [x0, y0] = pts[0]
        const [x1, y1] = pts[pts.length - 1]

        let totalError = 0

        for (let i = 0; i < pts.length; i++) {
            const t = i / (pts.length - 1)
            const lx = x0 + (x1 - x0) * t
            const ly = y0 + (y1 - y0) * t

            const [px, py] = pts[i]
            const dx = px - lx
            const dy = py - ly
            const dist = Math.hypot(dx, dy)

            totalError += dist
        }

        const error = totalError / pts.length

        return {
            cmd: { type: 'l', values: [x1, y1] },
            error
        }
    },

    
    approximateQuadratic(points: [number,number][], start: [number, number]): { cmd: PathCmd, error: number }|null {
        if (points.length < 2) return null

        const [x0, y0] = points[0]
        const [x2, y2] = points[points.length - 1]

        // Estimation du point de contrôle par interpolation inverse
        let cx = 0
        let cy = 0
        let totalWeight = 0

        for (let i = 1; i < points.length - 1; i++) {
            const t = i / (points.length - 1)
            const u = 1 - t
            const denom = 2 * u * t
            if (denom === 0) continue

            const [x, y] = points[i]

            const bx = (x - (u * u * x0 + t * t * x2)) / denom
            const by = (y - (u * u * y0 + t * t * y2)) / denom

            cx += bx
            cy += by
            totalWeight++
        }

        if (totalWeight === 0) {
            // Ne peut pas approximer, ligne droite à la place
            return {
            cmd: { type: 'l', values: [x2, y2] },
            error: 1e9
            }
        }

        cx /= totalWeight
        cy /= totalWeight

        // Calcul de l’erreur moyenne
        let totalError = 0
        for (let i = 0; i < points.length; i++) {
            const t = i / (points.length - 1)
            const u = 1 - t

            const qx = u * u * x0 + 2 * u * t * cx + t * t * x2
            const qy = u * u * y0 + 2 * u * t * cy + t * t * y2

            const [px, py] = points[i]
            const dx = px - qx
            const dy = py - qy
            const dist = Math.hypot(dx, dy)

            totalError += dist
        }

        const error = totalError / points.length

        return {
            cmd: { type: 'q', values: [cx, cy, x2, y2] },
            error
        }
    },

    approximateCubic(cmds: PathCmd[], start: [number, number], count = 20): { cmd: PathCmd, error: number } | null {
        const pts = this.getPointsMany(cmds, start, count)
        if (pts.length < 2) return null

        const [x0, y0] = pts[0]
        const [x3, y3] = pts[pts.length - 1]

        let cx1 = 0, cy1 = 0
        let cx2 = 0, cy2 = 0
        let totalWeight = 0

        for (let i = 1; i < pts.length - 1; i++) {
            const t = i / (pts.length - 1)
            const u = 1 - t
            const [x, y] = pts[i]

            const denom1 = 3 * u * u * t
            const denom2 = 3 * u * t * t

            if (denom1 + denom2 === 0) continue

            const px = x - (u * u * u * x0 + t * t * t * x3)
            const py = y - (u * u * u * y0 + t * t * t * y3)

            // Système approximatif : on répartit px entre cx1 et cx2 avec les coefficients denom1 et denom2
            const weight = denom1 + denom2
            const r = denom1 / weight

            cx1 += px * r / denom1
            cy1 += py * r / denom1
            cx2 += px * (1 - r) / denom2
            cy2 += py * (1 - r) / denom2

            totalWeight++
        }

        if (totalWeight === 0) {
            return {
                cmd: { type: 'l', values: [x3, y3] },
                error: 1e9
            }
        }

        cx1 = cx1 / totalWeight
        cy1 = cy1 / totalWeight
        cx2 = cx2 / totalWeight
        cy2 = cy2 / totalWeight

        // Calcul de l'erreur moyenne
        let totalError = 0
        for (let i = 0; i < pts.length; i++) {
            const t = i / (pts.length - 1)
            const u = 1 - t

            const bx =
                u * u * u * x0 +
                3 * u * u * t * cx1 +
                3 * u * t * t * cx2 +
                t * t * t * x3

            const by =
                u * u * u * y0 +
                3 * u * u * t * cy1 +
                3 * u * t * t * cy2 +
                t * t * t * y3

            const [px, py] = pts[i]
            const dx = px - bx
            const dy = py - by

            totalError += Math.hypot(dx, dy)
        }

        const error = totalError / pts.length

        return {
            cmd: { type: 'c', values: [cx1, cy1, cx2, cy2, x3, y3] },
            error
        }
    },

    approximateAuto( thresholdLine: number, thresholdQuadratic: number, thresholdCubic: number)
        : (cmds: PathCmd[], start: [number, number], count?: number) => { cmd: PathCmd, error: number } | null{
        return (cmds: PathCmd[], start: [number, number], count = 20) => {
            // Approx line
            const lineApprox = this.approximateLine(cmds, start, count)
            if (lineApprox && lineApprox.error <= thresholdLine) return lineApprox

            // Approx quadratic
            const quadApprox = this.approximateQuadratic(cmds, start, count)
            if (quadApprox && quadApprox.error <= thresholdQuadratic) return quadApprox

            // Approx cubic
            const cubicApprox = this.approximateCubic(cmds, start, count)
            if (cubicApprox && cubicApprox.error <= thresholdCubic) return cubicApprox

            // Sinon, retourne la meilleure approximation disponible
            const approximations = [lineApprox, quadApprox, cubicApprox].filter(Boolean) as { cmd: PathCmd, error: number }[]
            if (approximations.length === 0) return null

            approximations.sort((a, b) => a.error - b.error)
            return approximations[0]
        }
    },

    simplify(
        cmds: PathCmd[],
        approximateFn: (group: PathCmd[], start: [number, number], count?: number) => { cmd: PathCmd; error: number } | null,
        windowSize: number,
        threshold: number = 0.1,
        precision: number = 20
    ): PathCmd[] {
        const out: PathCmd[] = []

        let current: [number, number] = [0, 0]
        let subPathStart: [number, number] = [0, 0]

        let i = 0
        while (i < cmds.length) {
            const cmd = cmds[i]

            // Move command
            if (cmd.type === 'm') {
                out.push(cmd)
                current = cmd.values as [number, number]
                subPathStart = current
                i++
                continue
            }

            // Récupère les prochaines commandes pour l’approximation
            if (i + windowSize > cmds.length) {
                windowSize = cmds.length - i
            }
            if (windowSize < 1) {
                out.push(cmd)
                continue
            }

            // Récupère la liste de points à partir du point courant
            const group = cmds.slice(i, i + windowSize)

            const approx = approximateFn(group, current, precision)

            // Si l'approximation est valide et dans le seuil, on l'ajoute
            if(approx && approx.error < threshold) {
                out.push(approx.cmd)
            }
            else{
                out.push(...group)
            }

            // Met à jour le point courant
            const groupPoints = PATH_OPT.getPointsMany(group, current, 2)
            if (groupPoints.length > 0) {
                current = groupPoints[groupPoints.length - 1]
            }

            i+=windowSize
        }

        return out
    }


}