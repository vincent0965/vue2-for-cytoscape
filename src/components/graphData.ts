export const nodeData = [
    {
      data: {
        id: 'a1',
        type: 'type5',
        content: {
          company: 'AAA股份有限公司',
          companyStatus: '82069964'
        },
      },
      position: { x: 0, y: 0 },
    },
    {
      data: {
        id: 'a2',
        type: 'type1',
        content: {
          company: 'BBB股份有限公司',
          companyStatus: '44497782'
        },
      },
      position: { x: 500, y: 0 },
    },
    {
      data: {
        id: 'a3',
        type: 'type2',
        content: {
          company: 'CCC股份有限公司',
          companyStatus: '61550126'
        },
      },
      position: { x: 497.2637216, y: 52.23783275 },
    },
    {
      data: {
        id: 'a4',
        type: 'type3',
        content: {
          company: 'DDD股份有限公司',
          companyStatus: '77176635'
        },
      },
      position: { x: 489.0848353, y: 103.9039165 },
    },
    {
      data: {
        id: 'a5',
        type: 'type4',
        content: {
          company: 'EEE股份有限公司',
          companyStatus: '79298319'
        },
      },
      position: { x: 475.55286, y: 154.43276 },
    }
  ],
  edgeData = [
    {
      data: {
        id: '1',
        source: 'a1',
        target: 'a2',
        info: [
          { source: 'a1', company: 'AAA股份有限公司' },
          { target: 'a2', company: 'BBB股份有限公司' },
          { dataId: '1', tariff: '58508708', name: '戊戊戊戊戊戊戊戊', AMT_total: '733990' },
          { dataId: '2', tariff: '41037689', name: '己己己己己己己己', AMT_total: '689178' }
        ],
      },
    },
    {
      data: {
        id: '2',
        source: 'a1',
        target: 'a3',
        info: [
          { source: 'a1', company: 'AAA股份有限公司' },
          { target: 'a3', company: 'CCC股份有限公司' },
          { dataId: '1', tariff: '41487336', name: '庚庚庚庚庚庚庚庚', AMT_total: '439554' },
          { dataId: '2', tariff: '44309212', name: '丁丁丁丁丁丁丁丁', AMT_total: '996460' }
        ],
      },
    },
    {
      data: {
        id: '3',
        source: 'a1',
        target: 'a4',
        info: [
          { source: 'a1', company: 'AAA股份有限公司' },
          { target: 'a4', company: 'DDD股份有限公司' },
          { dataId: '1', tariff: '54079096', name: '乙乙乙乙乙乙乙乙', AMT_total: '638346' },
          { dataId: '2', tariff: '86089222', name: '辛辛辛辛辛辛辛辛', AMT_total: '100358' }
        ],
      },
    },
    {
      data: {
        id: '4',
        source: 'a5',
        target: 'a1',
        info: [
          { source: 'a1', company: 'AAA股份有限公司' },
          { target: 'a5', company: 'EEE股份有限公司' },
          { dataId: '1', tariff: '88367728', name: '壬壬壬壬壬壬壬壬', AMT_total: '347883' },
          { dataId: '2', tariff: '46074042', name: '壬壬壬壬壬壬壬壬', AMT_total: '172791' }
        ],
      },
    }
  ];
