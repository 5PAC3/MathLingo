'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useI18n } from '@/lib/i18n'
import katex from 'katex'

function renderFormula(formula: string): string {
  try {
    return katex.renderToString(formula, { throwOnError: false, displayMode: true })
  } catch {
    return formula
  }
}

interface FormulaGroup {
  titleKey: string
  formulas: { nameKey: string; tex: string }[]
}

const SECTIONS: { categoryKey: string; color: string; groups: FormulaGroup[] }[] = [
  {
    categoryKey: 'form.category.aritmetica',
    color: 'var(--cat-aritmetica)',
    groups: [
      {
        titleKey: 'form.group.basic_operations',
        formulas: [
          { nameKey: 'form.name.addition', tex: 'a + b = c' },
          { nameKey: 'form.name.subtraction', tex: 'a - b = c' },
          { nameKey: 'form.name.multiplication', tex: 'a \\times b = c' },
          { nameKey: 'form.name.division', tex: 'a : b = c \\quad (b \\neq 0)' },
        ],
      },
      {
        titleKey: 'form.group.powers',
        formulas: [
          { nameKey: 'form.name.definition', tex: 'a^n = a \\times a \\times \\ldots \\times a \\;(n\\text{ volte})' },
          { nameKey: 'form.name.product', tex: 'a^n \\times a^m = a^{n+m}' },
          { nameKey: 'form.name.quotient', tex: 'a^n : a^m = a^{n-m}' },
          { nameKey: 'form.name.power_of_power', tex: '(a^n)^m = a^{n \\times m}' },
          { nameKey: 'form.name.negative_power', tex: 'a^{-n} = \\frac{1}{a^n}' },
        ],
      },
      {
        titleKey: 'form.group.roots',
        formulas: [
          { nameKey: 'form.name.square_root', tex: '\\sqrt{a} = b \\iff b^2 = a' },
          { nameKey: 'form.name.nth_root', tex: '\\sqrt[n]{a} = b \\iff b^n = a' },
          { nameKey: 'form.name.product_of_roots', tex: '\\sqrt{a} \\times \\sqrt{b} = \\sqrt{a \\times b}' },
        ],
      },
      {
        titleKey: 'form.group.fractions',
        formulas: [
          { nameKey: 'form.name.fraction_add', tex: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}' },
          { nameKey: 'form.name.fraction_mul', tex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}' },
          { nameKey: 'form.name.fraction_div', tex: '\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}' },
        ],
      },
      {
        titleKey: 'form.group.proportions',
        formulas: [
          { nameKey: 'form.name.definition', tex: 'a : b = c : d \\iff a \\times d = b \\times c' },
          { nameKey: 'form.name.direct_proportion', tex: '\\frac{y}{x} = k \\implies y = kx' },
          { nameKey: 'form.name.inverse_proportion', tex: 'x \\times y = k' },
        ],
      },
      {
        titleKey: 'form.group.percentages',
        formulas: [
          { nameKey: 'form.name.percentage_def', tex: 'p\\% = \\frac{p}{100}' },
          { nameKey: 'form.name.percentage_calc', tex: '\\frac{p}{100} \\times \\text{totale}' },
        ],
      },
      {
        titleKey: 'form.group.lcm_gcd',
        formulas: [
          { nameKey: 'form.name.gcd', tex: '\\gcd(a,b) = \\text{massimo divisore comune}' },
          { nameKey: 'form.name.lcm', tex: '\\operatorname{lcm}(a,b) = \\frac{a \\times b}{\\gcd(a,b)}' },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.algebra',
    color: 'var(--cat-algebra)',
    groups: [
      {
        titleKey: 'form.group.remarkable_products',
        formulas: [
          { nameKey: 'form.name.binomial_square_sum', tex: '(a + b)^2 = a^2 + 2ab + b^2' },
          { nameKey: 'form.name.binomial_square_diff', tex: '(a - b)^2 = a^2 - 2ab + b^2' },
          { nameKey: 'form.name.diff_of_squares', tex: '(a + b)(a - b) = a^2 - b^2' },
          { nameKey: 'form.name.binomial_cube_sum', tex: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3' },
          { nameKey: 'form.name.binomial_cube_diff', tex: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3' },
        ],
      },
      {
        titleKey: 'form.group.factoring',
        formulas: [
          { nameKey: 'form.name.common_factor', tex: 'ax + bx = x(a + b)' },
          { nameKey: 'form.name.special_trinomial', tex: "x^2 + sx + p = (x + a)(x + b) \\;(a+b=s,\\, a\\times b=p)" },
          { nameKey: 'form.name.sum_of_cubes', tex: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)' },
          { nameKey: 'form.name.diff_of_cubes', tex: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)' },
        ],
      },
      {
        titleKey: 'form.group.linear_equations',
        formulas: [
          { nameKey: 'form.name.general_form', tex: 'ax + b = 0 \\implies x = -\\frac{b}{a} \\;(a \\neq 0)' },
        ],
      },
      {
        titleKey: 'form.group.quadratic_equations',
        formulas: [
          { nameKey: 'form.name.general_form', tex: 'ax^2 + bx + c = 0' },
          { nameKey: 'form.name.quadratic_formula', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
          { nameKey: 'form.name.delta', tex: '\\Delta = b^2 - 4ac' },
          { nameKey: 'form.name.delta_positive', tex: 'x_1 \\neq x_2 \\;\\text{(due soluzioni reali)}' },
          { nameKey: 'form.name.delta_zero', tex: 'x_1 = x_2 = -\\frac{b}{2a}' },
          { nameKey: 'form.name.delta_negative', tex: '\\text{nessuna soluzione reale}' },
        ],
      },
      {
        titleKey: 'form.group.quadratic_inequalities',
        formulas: [
          { nameKey: 'form.name.sign_rule', tex: 'ax^2 + bx + c > 0 \\implies \\text{segno di }a\\text{ fuori dalle radici}' },
        ],
      },
      {
        titleKey: 'form.group.polynomial_division',
        formulas: [
          { nameKey: 'form.name.division', tex: 'P(x) : (x - a) \\implies Q(x) + \\frac{R}{x-a}' },
          { nameKey: 'form.name.remainder_theorem', tex: 'R = P(a)' },
        ],
      },
      {
        titleKey: 'form.group.linear_systems',
        formulas: [
          { nameKey: 'form.name.general_2x2', tex: '\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}' },
          { nameKey: 'form.name.cramer_rule', tex: 'x = \\frac{ \\begin{vmatrix} c & b \\\\ f & e \\end{vmatrix} }{ \\begin{vmatrix} a & b \\\\ d & e \\end{vmatrix} }' },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.logica',
    color: 'var(--cat-logica)',
    groups: [
      {
        titleKey: 'form.group.boolean_algebra',
        formulas: [
          { nameKey: 'form.name.definition', tex: 'A \\land B = \\text{Vero solo se entrambi Vero}' },
          { nameKey: 'form.name.product', tex: 'A \\lor B = \\text{Vero se almeno uno Vero}' },
          { nameKey: 'form.name.negative_power', tex: '\\lnot A = \\text{inverte il valore}' },
          { nameKey: 'form.name.division', tex: '\\lnot(A \\land B)' },
          { nameKey: 'form.name.fraction_mul', tex: '\\lnot(A \\lor B)' },
          { nameKey: 'form.name.subtraction', tex: 'A \\oplus B = \\text{Vero se diversi}' },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.geometria',
    color: 'var(--cat-geometria)',
    groups: [
      {
        titleKey: 'form.group.plane_geometry',
        formulas: [
          { nameKey: 'form.name.rectangle_area', tex: 'A = b \\times h' },
          { nameKey: 'form.name.rectangle_perimeter', tex: 'P = 2(b + h)' },
          { nameKey: 'form.name.triangle_area', tex: 'A = \\frac{b \\times h}{2}' },
          { nameKey: 'form.name.circle_area', tex: 'A = \\pi r^2' },
          { nameKey: 'form.name.circumference', tex: 'C = 2\\pi r' },
          { nameKey: 'form.name.square_area', tex: 'A = l^2' },
        ],
      },
      {
        titleKey: 'form.group.pythagorean',
        formulas: [
          { nameKey: 'form.name.hypotenuse', tex: 'i^2 = c_1^2 + c_2^2' },
          { nameKey: 'form.name.leg', tex: 'c_1 = \\sqrt{i^2 - c_2^2}' },
        ],
      },
      {
        titleKey: 'form.group.solid_geometry',
        formulas: [
          { nameKey: 'form.name.cube_volume', tex: 'V = l^3' },
          { nameKey: 'form.name.cube_surface', tex: 'S = 6l^2' },
          { nameKey: 'form.name.parallelepiped_volume', tex: 'V = a \\times b \\times c' },
          { nameKey: 'form.name.cylinder_volume', tex: 'V = \\pi r^2 h' },
          { nameKey: 'form.name.cylinder_surface', tex: 'S = 2\\pi r(r + h)' },
        ],
      },
      {
        titleKey: 'form.group.trigonometry',
        formulas: [
          { nameKey: 'form.name.sine', tex: '\\sin \\theta = \\frac{\\text{cateto opposto}}{\\text{ipotenusa}}' },
          { nameKey: 'form.name.cosine', tex: '\\cos \\theta = \\frac{\\text{cateto adiacente}}{\\text{ipotenusa}}' },
          { nameKey: 'form.name.tangent', tex: '\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}' },
          { nameKey: 'form.name.notable_values_30', tex: '\\sin 30^\\circ = \\frac{1}{2},\\; \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}' },
          { nameKey: 'form.name.notable_values_45', tex: '\\sin 45^\\circ = \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}' },
          { nameKey: 'form.name.notable_values_60', tex: '\\sin 60^\\circ = \\frac{\\sqrt{3}}{2},\\; \\cos 60^\\circ = \\frac{1}{2}' },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.geometria_analitica',
    color: 'var(--cat-geometria-analitica)',
    groups: [
      {
        titleKey: 'form.group.line',
        formulas: [
          { nameKey: 'form.name.explicit_form', tex: 'y = mx + q' },
          { nameKey: 'form.name.implicit_form', tex: 'ax + by + c = 0' },
          { nameKey: 'form.name.slope', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}' },
          { nameKey: 'form.name.parallel_lines', tex: 'm_1 = m_2' },
          { nameKey: 'form.name.perpendicular_lines', tex: 'm_1 \\times m_2 = -1' },
          { nameKey: 'form.name.point_line_distance', tex: 'd = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}' },
        ],
      },
      {
        titleKey: 'form.group.parabola',
        formulas: [
          { nameKey: 'form.name.definition', tex: 'y = ax^2 + bx + c' },
          { nameKey: 'form.name.vertex', tex: "V\\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)" },
          { nameKey: 'form.name.focus', tex: "F\\left(-\\frac{b}{2a}, \\frac{1-\\Delta}{4a}\\right)" },
          { nameKey: 'form.name.directrix', tex: 'y = -\\frac{1+\\Delta}{4a}' },
          { nameKey: 'form.name.axis_of_symmetry', tex: 'x = -\\frac{b}{2a}' },
        ],
      },
      {
        titleKey: 'form.group.circle',
        formulas: [
          { nameKey: 'form.name.definition', tex: 'x^2 + y^2 + ax + by + c = 0' },
          { nameKey: 'form.name.center', tex: "C\\left(-\\frac{a}{2}, -\\frac{b}{2}\\right)" },
          { nameKey: 'form.name.radius', tex: 'r = \\sqrt{\\left(\\frac{a}{2}\\right)^2 + \\left(\\frac{b}{2}\\right)^2 - c}' },
          { nameKey: 'form.name.center_radius_eq', tex: '(x - x_C)^2 + (y - y_C)^2 = r^2' },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.analisi',
    color: 'var(--cat-analisi)',
    groups: [
      {
        titleKey: 'form.group.functions',
        formulas: [
          { nameKey: 'form.name.domain_fraction', tex: '\\text{denominatore} \\neq 0' },
          { nameKey: 'form.name.domain_even_root', tex: '\\text{radicando} \\geq 0' },
          { nameKey: 'form.name.composition', tex: '(f \\circ g)(x) = f(g(x))' },
        ],
      },
      {
        titleKey: 'form.group.limits',
        formulas: [
          { nameKey: 'form.name.definition', tex: '\\lim_{x \\to c} f(x) = L' },
          { nameKey: 'form.name.limit_sum', tex: '\\lim (f+g) = \\lim f + \\lim g' },
          { nameKey: 'form.name.limit_product', tex: '\\lim (f \\cdot g) = \\lim f \\cdot \\lim g' },
          { nameKey: 'form.name.limit_quotient', tex: '\\lim \\frac{f}{g} = \\frac{\\lim f}{\\lim g}\\;(\\lim g \\neq 0)' },
        ],
      },
      {
        titleKey: 'form.group.derivatives',
        formulas: [
          { nameKey: 'form.name.definition', tex: "f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0+h) - f(x_0)}{h}" },
          { nameKey: 'form.name.derivative_xn', tex: "\\frac{d}{dx}x^n = nx^{n-1}" },
          { nameKey: 'form.name.derivative_constant', tex: "\\frac{d}{dx}k = 0" },
          { nameKey: 'form.name.product_rule', tex: "(f \\cdot g)' = f' \\cdot g + f \\cdot g'" },
          { nameKey: 'form.name.quotient_rule', tex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}" },
          { nameKey: 'form.name.chain_rule', tex: "(f \\circ g)' = f'(g(x)) \\cdot g'(x)" },
          { nameKey: 'form.name.derivative_ex', tex: "\\frac{d}{dx}e^x = e^x" },
          { nameKey: 'form.name.derivative_ln', tex: "\\frac{d}{dx}\\ln x = \\frac{1}{x}" },
          { nameKey: 'form.name.derivative_sin', tex: "\\frac{d}{dx}\\sin x = \\cos x" },
          { nameKey: 'form.name.derivative_cos', tex: "\\frac{d}{dx}\\cos x = -\\sin x" },
        ],
      },
      {
        titleKey: 'form.group.integrals',
        formulas: [
          { nameKey: 'form.name.integral_xn', tex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C\\;(n \\neq -1)' },
          { nameKey: 'form.name.integral_1_over_x', tex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C' },
          { nameKey: 'form.name.integral_ex', tex: '\\int e^x\\,dx = e^x + C' },
          { nameKey: 'form.name.integral_sin', tex: '\\int \\sin x\\,dx = -\\cos x + C' },
          { nameKey: 'form.name.integral_cos', tex: '\\int \\cos x\\,dx = \\sin x + C' },
          { nameKey: 'form.name.definite_integral', tex: '\\int_a^b f(x)\\,dx = F(b) - F(a)' },
          { nameKey: 'form.name.integration_by_parts', tex: "\\int f \\cdot g'\\,dx = f \\cdot g - \\int f' \\cdot g\\,dx" },
        ],
      },
    ],
  },
  {
    categoryKey: 'form.category.probabilita',
    color: 'var(--cat-probabilita)',
    groups: [
      {
        titleKey: 'form.group.probability',
        formulas: [
          { nameKey: 'form.name.classical_def', tex: 'P(E) = \\frac{\\text{casi favorevoli}}{\\text{casi possibili}}' },
          { nameKey: 'form.name.conditional_prob', tex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}' },
          { nameKey: 'form.name.independent_events', tex: 'P(A \\cap B) = P(A) \\times P(B)' },
        ],
      },
      {
        titleKey: 'form.group.statistics',
        formulas: [
          { nameKey: 'form.name.mean', tex: '\\bar{x} = \\frac{\\sum x_i}{n}' },
          { nameKey: 'form.name.median', tex: '\\text{valore centrale dei dati ordinati}' },
          { nameKey: 'form.name.mode', tex: '\\text{valore con frequenza maggiore}' },
          { nameKey: 'form.name.variance', tex: '\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}' },
          { nameKey: 'form.name.std_deviation', tex: '\\sigma = \\sqrt{\\sigma^2}' },
        ],
      },
      {
        titleKey: 'form.group.combinatorics',
        formulas: [
          { nameKey: 'form.name.permutations', tex: 'P_n = n!' },
          { nameKey: 'form.name.dispositions', tex: 'D_{n,k} = \\frac{n!}{(n-k)!}' },
          { nameKey: 'form.name.combinations', tex: 'C_{n,k} = \\frac{n!}{k!(n-k)!}' },
        ],
      },
    ],
  },
]

export default function FormularioPage() {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '0.5rem', paddingBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          {t('heading.formulary')}
        </h1>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          {t('prompt.formulary')}
        </p>

        {SECTIONS.map(section => (
          <div key={section.categoryKey} style={{ marginTop: '1.5rem' }}>
            <div
              className="card"
              style={{
                borderLeft: `4px solid ${section.color}`,
                marginBottom: '0.75rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  margin: 0,
                  color: section.color,
                }}
              >
                {t(section.categoryKey)}
              </h2>
            </div>

            <div className="flex flex-wrap" style={{ gap: '0.75rem', width: '100%' }}>
              {section.groups.map(group => (
                <div
                  key={group.titleKey}
                  className="card"
                  style={{
                    flex: '1 1 320px',
                    minWidth: 280,
                    maxWidth: '100%',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginTop: 0,
                      marginBottom: '0.75rem',
                      color: 'var(--fg)',
                      borderBottom: '1px solid var(--card-border)',
                      paddingBottom: '0.4rem',
                    }}
                  >
                    {t(group.titleKey)}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {group.formulas.map(f => (
                      <div key={f.nameKey}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--fg-muted)',
                            marginBottom: '0.15rem',
                            opacity: 0.7,
                          }}
                        >
                          {t(f.nameKey)}
                        </div>
                        {mounted ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: renderFormula(f.tex) }}
                            style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
                          />
                        ) : (
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              color: 'var(--fg-muted)',
                              padding: '0.25rem 0',
                            }}
                          >
                            {f.tex}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
